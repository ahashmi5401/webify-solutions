import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateCourseSchema } from '@/lib/validations';
import { requireAdminOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;
    const userRole = session?.user ? (session.user as any).role : null;

    const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

    const course = await prisma.course.findUnique({
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
                ...(isAdmin ? { content: true, videoUrl: true } : {}),
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

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (!course.isPublished) {
      if (!isAdmin) {
        throw new ForbiddenError('Course not published');
      }
    }

    return NextResponse.json(course);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    const body = await req.json();
    const validated = updateCourseSchema.parse(body);

    const course = await prisma.course.update({
      where: { slug },
      data: validated,
    });

    return NextResponse.json(course);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    await prisma.course.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
