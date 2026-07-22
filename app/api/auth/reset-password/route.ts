import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/validations';
import { ValidationError, NotFoundError, handleApiError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const password_hash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
