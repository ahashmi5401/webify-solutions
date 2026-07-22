import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { careerListingSchema, careerQuerySchema } from '@/lib/validations';
import { canManageCareers } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = careerQuerySchema.parse(Object.fromEntries(searchParams));

    const where: any = { isActive: true };

    if (query.department) {
      where.department = query.department;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    const careers = await prisma.careerListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(careers);
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
    if (!canManageCareers(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = careerListingSchema.parse(body);

    const career = await prisma.careerListing.create({
      data: validated,
    });

    return NextResponse.json(career, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
