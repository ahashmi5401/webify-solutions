import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inquirySchema, updateInquirySchema } from '@/lib/validations';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { checkContactRateLimit } from '@/lib/ratelimit';
import { canManageInquiries } from '@/lib/rbac';
import { sendContactNotification } from '@/lib/resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    if (!canManageInquiries(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const { searchParams } = new URL(req.url);
    const source = searchParams.get('source');
    const status = searchParams.get('status');

    const where: any = {};

    if (source) {
      where.source = source;
    }

    if (status) {
      where.status = status;
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = inquirySchema.parse(body);

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    await checkContactRateLimit(ip);
    await verifyTurnstileToken(validated.turnstileToken);

    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    const inquiry = await prisma.inquiry.create({
      data: {
        name: validated.name,
        email: validated.email,
        message: validated.message,
        source: validated.source,
        userId,
      },
    });

    await sendContactNotification(
      validated.name,
      validated.email,
      validated.message,
      validated.source
    );

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
