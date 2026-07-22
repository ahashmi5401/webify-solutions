import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateServiceSchema } from '@/lib/validations';
import { requireAdminOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    if (!service.isActive) {
      const session = await getServerSession(authOptions);
      const userRole = session?.user ? (session.user as any).role : null;
      
      if (!userRole || userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        throw new ForbiddenError('Service not available');
      }
    }

    return NextResponse.json(service);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    const body = await req.json();
    const validated = updateServiceSchema.parse(body);

    const service = await prisma.service.update({
      where: { slug: params.slug },
      data: validated,
    });

    return NextResponse.json(service);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireAdminOrAbove(userRole);

    await prisma.service.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
