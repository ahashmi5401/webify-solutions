import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { changePasswordSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError, ValidationError } from '@/lib/errors';
import bcrypt from 'bcryptjs';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userId = (session.user as any).id;

    const body = await req.json();
    const validated = changePasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password_hash: true,
      },
    });

    if (!user || !user.password_hash) {
      throw new ValidationError('User not found or no password set');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      validated.currentPassword,
      user.password_hash
    );

    if (!isCurrentPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(validated.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash },
    });

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
