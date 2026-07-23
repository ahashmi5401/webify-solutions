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

    // Verify all modules belong to the same course
    const modules = await prisma.module.findMany({
      where: {
        id: { in: validated.items.map(item => item.id) },
      },
      select: {
        id: true,
        courseId: true,
      },
    });

    if (modules.length !== validated.items.length) {
      throw new ValidationError('One or more modules not found');
    }

    const courseIds = new Set(modules.map((m: any) => m.courseId));
    if (courseIds.size > 1) {
      throw new ValidationError('All modules must belong to the same course');
    }

    // Update all module orders in a single transaction
    await prisma.$transaction(
      validated.items.map(item =>
        prisma.module.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ message: 'Modules reordered successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
