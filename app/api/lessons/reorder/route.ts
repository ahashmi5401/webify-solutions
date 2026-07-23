import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reorderSchema } from '@/lib/validations';
import { requireAdminOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError, ValidationError } from '@/lib/errors';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    const body = await req.json();
    const validated = reorderSchema.parse(body);

    // Verify all lessons belong to the same module
    const lessons = await prisma.lesson.findMany({
      where: {
        id: { in: validated.items.map(item => item.id) },
      },
      select: {
        id: true,
        moduleId: true,
      },
    });

    if (lessons.length !== validated.items.length) {
      throw new ValidationError('One or more lessons not found');
    }

    const moduleIds = new Set(lessons.map((l: any) => l.moduleId));
    if (moduleIds.size > 1) {
      throw new ValidationError('All lessons must belong to the same module');
    }

    // Update all lesson orders in a single transaction
    await prisma.$transaction(
      validated.items.map(item =>
        prisma.lesson.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ message: 'Lessons reordered successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
