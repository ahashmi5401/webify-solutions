import { prisma } from '@/lib/prisma';

export async function getPortfolioItems(includeUnpublished = false) {
  const where = includeUnpublished ? {} : { isPublished: true };

  return prisma.portfolio.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPortfolioBySlug(slug: string) {
  return prisma.portfolio.findUnique({
    where: { slug },
  });
}
