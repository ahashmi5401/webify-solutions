import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateTestimonialSchema } from '@/lib/validations';
import { canManageTestimonials } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/errors';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!testimonial) {
      throw new NotFoundError('Testimonial not found');
    }

    if (!testimonial.isPublished) {
      const session = await getServerSession(authOptions);
      const userRole = session?.user ? (session.user as any).role : null;
      
      if (!userRole || !canManageTestimonials(userRole)) {
        throw new ForbiddenError('Testimonial not published');
      }
    }

    return NextResponse.json(testimonial);
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
    if (!canManageTestimonials(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const body = await req.json();
    const validated = updateTestimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(testimonial);
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
    if (!canManageTestimonials(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
