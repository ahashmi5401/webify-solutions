import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validations';
import { sendNewsletterConfirmation } from '@/lib/resend';
import { handleApiError, ConflictError } from '@/lib/errors';

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
