import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { userProfileSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError } from '@/lib/errors';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userId = (session.user as any).id;

    const body = await req.json();
    const validated = userProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validated,
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
