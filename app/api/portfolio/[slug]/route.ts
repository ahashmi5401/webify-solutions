import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updatePortfolioSchema } from '@/lib/validations';
import { canManagePortfolio } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
    });

    if (!portfolio) {
      throw new NotFoundError('Portfolio item not found');
    }

    if (!portfolio.isPublished) {
      const session = await getServerSession(authOptions);
      const userRole = session?.user ? (session.user as any).role : null;
      
      if (!userRole || !canManagePortfolio(userRole)) {
        throw new ForbiddenError('Portfolio item not published');
      }
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    if (!canManagePortfolio(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = updatePortfolioSchema.parse(body);

    const portfolio = await prisma.portfolio.update({
      where: { slug },
      data: validated,
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    if (!canManagePortfolio(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    await prisma.portfolio.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
