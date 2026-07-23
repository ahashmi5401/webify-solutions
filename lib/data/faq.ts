import { prisma } from '@/lib/prisma';

export async function getFaqs(category?: string) {
  const where = category ? { category } : {};

  return prisma.fAQ.findMany({
    where,
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });
}
