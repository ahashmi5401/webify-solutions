import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pricingPlanSchema } from '@/lib/validations';
import { canManagePricing } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const pricingPlans = await prisma.pricingPlan.findMany({
      orderBy: [{ order: 'asc' }],
    });

    return NextResponse.json(pricingPlans);
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
    if (!canManagePricing(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = pricingPlanSchema.parse(body);

    const pricingPlan = await prisma.pricingPlan.create({
      data: validated,
    });

    return NextResponse.json(pricingPlan, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
