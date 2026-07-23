import { prisma } from '@/lib/prisma';

export async function getTestimonials(includeUnpublished = false) {
  const where = includeUnpublished ? {} : { isPublished: true };

  return prisma.testimonial.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}
