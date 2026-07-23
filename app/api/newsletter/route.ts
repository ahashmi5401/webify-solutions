import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema, newsletterQuerySchema } from '@/lib/validations';
import { sendNewsletterConfirmation } from '@/lib/resend';
import { requireEditorOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ConflictError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireEditorOrAbove(userRole);

    const { searchParams } = new URL(req.url);
    const query = newsletterQuerySchema.parse(Object.fromEntries(searchParams));

    const where: any = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [subscriptions, total] = await Promise.all([
      prisma.newsletterSub.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { subscribedAt: 'desc' },
      }),
      prisma.newsletterSub.count({ where }),
    ]);

    return NextResponse.json({
      data: subscriptions,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = newsletterSchema.parse(body);

    const existingSubscription = await prisma.newsletterSub.findUnique({
      where: { email: validated.email },
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        throw new ConflictError('Already subscribed to newsletter');
      }

      await prisma.newsletterSub.update({
        where: { email: validated.email },
        data: {
          isActive: true,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });

      return NextResponse.json({ message: 'Newsletter subscription reactivated' });
    }

    await prisma.newsletterSub.create({
      data: {
        email: validated.email,
        isActive: true,
      },
    });

    await sendNewsletterConfirmation(validated.email);

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' }, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      throw new Error('Email is required');
    }

    const subscription = await prisma.newsletterSub.findUnique({
      where: { email },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await prisma.newsletterSub.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
