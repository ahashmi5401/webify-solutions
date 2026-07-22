import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { lessonSchema } from '@/lib/validations';
import { requireAdminOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get('moduleId');

    const where = moduleId ? { moduleId } : {};

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        module: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(lessons);
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
    const validated = lessonSchema.parse(body);

    const lesson = await prisma.lesson.create({
      data: validated,
      include: {
        module: true,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
