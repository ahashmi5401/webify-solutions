import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { portfolioSchema } from '@/lib/validations';
import { canManagePortfolio } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    const where = includeUnpublished ? {} : { isPublished: true };

    const portfolioItems = await prisma.portfolio.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(portfolioItems);
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
    if (!canManagePortfolio(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = portfolioSchema.parse(body);

    const portfolio = await prisma.portfolio.create({
      data: validated,
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
