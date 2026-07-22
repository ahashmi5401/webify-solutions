import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updatePricingPlanSchema } from '@/lib/validations';
import { canManagePricing } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pricingPlan = await prisma.pricingPlan.findUnique({
      where: { id: params.id },
    });

    if (!pricingPlan) {
      throw new NotFoundError('Pricing plan not found');
    }

    return NextResponse.json(pricingPlan);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    if (!canManagePricing(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = updatePricingPlanSchema.parse(body);

    const pricingPlan = await prisma.pricingPlan.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(pricingPlan);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    if (!canManagePricing(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    await prisma.pricingPlan.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Pricing plan deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
