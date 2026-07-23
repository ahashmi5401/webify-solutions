import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateLessonSchema } from '@/lib/validations';
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

    if (isAdmin) {
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        select: {
          id: true,
          moduleId: true,
          title: true,
          order: true,
          isFreePreview: true,
          content: true,
          videoUrl: true,
          module: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!lesson) {
        throw new NotFoundError('Lesson not found');
      }

      return NextResponse.json(lesson);
    }

    const lessonBase = await prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        isFreePreview: true,
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!lessonBase) {
      throw new NotFoundError('Lesson not found');
    }

    let canAccessContent = lessonBase.isFreePreview;

    if (!canAccessContent && userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lessonBase.module.courseId,
          },
        },
        select: { status: true },
      });
      if (enrollment?.status === 'ACTIVE') {
        canAccessContent = true;
      }
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        moduleId: true,
        title: true,
        order: true,
        isFreePreview: true,
        ...(canAccessContent ? { content: true, videoUrl: true } : {}),
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json(lesson);
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
    const validated = updateLessonSchema.parse(body);

    const lesson = await prisma.lesson.update({
      where: { id },
      data: validated,
      include: {
        module: true,
      },
    });

    return NextResponse.json(lesson);
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

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
