import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { faqSchema } from '@/lib/validations';
import { canManageFAQ } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });

    return NextResponse.json(faqs);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    if (!canManageFAQ(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = faqSchema.parse(body);

    const faq = await prisma.fAQ.create({
      data: validated,
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
