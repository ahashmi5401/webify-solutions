import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface CourseQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
}

export async function getCourses(params: CourseQueryParams = {}) {
  const {
    page = 1,
    limit = 6,
    category,
    level,
    search,
  } = params;

  const where: any = {};

  if (category) {
    where.category = category;
  }

  if (level) {
    where.level = level;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
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
                ...(isAdmin ? { content: true, videoUrl: true } : { videoUrl: true }),
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
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({ where: { ...where, isPublished: true } }),
  ]);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCourseBySlug(slug: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as any).id : null;
  const userRole = session?.user ? (session.user as any).role : null;

  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  return prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              order: true,
              isFreePreview: true,
              ...(isAdmin ? { content: true, videoUrl: true } : { videoUrl: true }),
            },
            orderBy: { order: 'asc' },
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
  });
}
