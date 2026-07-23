import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateUserRoleSchema } from '@/lib/validations';
import { requireSuperAdmin } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError, NotFoundError, ConflictError } from '@/lib/errors';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireSuperAdmin(userRole);

    const currentUserId = (session.user as any).id;
    const { id: targetUserId } = await params;

    // Parse and validate request body exactly once
    const body = await req.json();
    const validated = updateUserRoleSchema.parse(body);

    // Prevent self-demotion
    if (currentUserId === targetUserId) {
      if (validated.role !== 'SUPER_ADMIN') {
        throw new ConflictError('Cannot demote yourself from Super Admin role');
      }
    }

    // Check if this is the last Super Admin
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { role: true },
    });

    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    if (targetUser.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { role: 'SUPER_ADMIN' },
      });

      if (superAdminCount === 1) {
        if (validated.role !== 'SUPER_ADMIN') {
          throw new ConflictError('Cannot remove the last Super Admin');
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: validated.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userType: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
