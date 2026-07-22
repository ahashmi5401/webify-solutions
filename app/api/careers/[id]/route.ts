import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateCareerListingSchema } from '@/lib/validations';
import { canManageCareers } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const career = await prisma.careerListing.findUnique({
      where: { id: params.id },
    });

    if (!career) {
      throw new NotFoundError('Career listing not found');
    }

    if (!career.isActive) {
      const session = await getServerSession(authOptions);
      const userRole = session?.user ? (session.user as any).role : null;
      
      if (!userRole || !canManageCareers(userRole)) {
        throw new ForbiddenError('Career listing not active');
      }
    }

    return NextResponse.json(career);
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
    if (!canManageCareers(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = updateCareerListingSchema.parse(body);

    const career = await prisma.careerListing.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(career);
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
    if (!canManageCareers(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    await prisma.careerListing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Career listing deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
