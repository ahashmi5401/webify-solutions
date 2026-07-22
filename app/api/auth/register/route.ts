import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendVerificationEmail } from '@/lib/resend';
import { checkAuthRateLimit } from '@/lib/ratelimit';
import { ConflictError, ValidationError, handleApiError } from '@/lib/errors';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    await checkAuthRateLimit(validated.email);
    await verifyTurnstileToken(validated.turnstileToken);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const password_hash = await bcrypt.hash(validated.password, 12);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password_hash,
        role: 'USER',
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: validated.email,
        token: verificationToken,
        expires: verificationExpires,
      },
    });

    await sendVerificationEmail(validated.email, validated.name, verificationToken);

    return NextResponse.json(
      {
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
