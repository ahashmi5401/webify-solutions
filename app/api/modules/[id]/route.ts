import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateModuleSchema } from '@/lib/validations';
import { requireAdminOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;
    const userRole = session?.user ? (session.user as any).role : null;

    const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

    const moduleBase = await prisma.module.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!moduleBase) {
      throw new NotFoundError('Module not found');
    }

    let hasFullCourseAccess = isAdmin;

    if (!hasFullCourseAccess && userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: moduleBase.courseId,
          },
        },
        select: { status: true },
      });
      if (enrollment?.status === 'ACTIVE') {
        hasFullCourseAccess = true;
      }
    }

    if (hasFullCourseAccess) {
      const lessons = await prisma.lesson.findMany({
        where: { moduleId: id },
        select: {
          id: true,
          moduleId: true,
          title: true,
          order: true,
          isFreePreview: true,
          content: true,
          videoUrl: true,
        },
        orderBy: { order: 'asc' },
      });

      return NextResponse.json({
        ...moduleBase,
        lessons,
      });
    }

    const [freeLessons, restrictedLessons] = await Promise.all([
      prisma.lesson.findMany({
        where: { moduleId: id, isFreePreview: true },
        select: {
          id: true,
          moduleId: true,
          title: true,
          order: true,
          isFreePreview: true,
          content: true,
          videoUrl: true,
        },
      }),
      prisma.lesson.findMany({
        where: { moduleId: id, isFreePreview: false },
        select: {
          id: true,
          moduleId: true,
          title: true,
          order: true,
          isFreePreview: true,
        },
      }),
    ]);

    const lessons = [...freeLessons, ...restrictedLessons].sort(
      (a, b) => a.order - b.order
    );

    return NextResponse.json({
      ...moduleBase,
      lessons,
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    const body = await req.json();
    const validated = updateModuleSchema.parse(body);

    const module = await prisma.module.update({
      where: { id },
      data: validated,
      include: {
        lessons: true,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    await prisma.module.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
