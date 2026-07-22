import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { courseSchema, courseQuerySchema } from '@/lib/validations';
import { canManageCourses, requireAdminOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';
import { checkPublicApiRateLimit } from '@/lib/ratelimit';

export async function GET(req: NextRequest) {
  try {
    await checkPublicApiRateLimit(req.headers.get('x-forwarded-for') || 'unknown');

    const { searchParams } = new URL(req.url);
    const query = courseQuerySchema.parse(Object.fromEntries(searchParams));

    const where: any = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.level) {
      where.level = query.level;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;
    const userRole = session?.user ? (session.user as any).role : null;

    const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: { ...where, isPublished: true },
        include: {
          modules: {
            include: {
              lessons: {
                select: {
                  id: true,
                  title: true,
                  order: true,
                  isFreePreview: true,
                  ...(isAdmin ? { content: true, videoUrl: true, duration: true } : {}),
                },
              },
            },
            orderBy: { order: 'asc' },
          },
          _count: {
            select: { enrollments: true },
          },
          ...(userId ? {
            enrollments: {
              where: { userId },
              select: { id: true, status: true },
            },
          } : {}),
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where: { ...where, isPublished: true } }),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    const body = await req.json();
    const validated = courseSchema.parse(body);

    const course = await prisma.course.create({
      data: validated,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
