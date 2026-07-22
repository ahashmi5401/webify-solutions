import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enrollmentSchema, updateEnrollmentSchema } from '@/lib/validations';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError, ConflictError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    let where: any = {};

    if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      where.userId = userId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return NextResponse.json(enrollments);
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

    const userId = (session.user as any).id;

    const body = await req.json();
    const validated = enrollmentSchema.parse(body);

    await verifyTurnstileToken(validated.turnstileToken);

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: validated.courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictError('Already enrolled in this course');
    }

    const course = await prisma.course.findUnique({
      where: { id: validated.courseId },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (!course.isPublished) {
      throw new ForbiddenError('Course is not available for enrollment');
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: validated.courseId,
        status: 'ACTIVE',
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
