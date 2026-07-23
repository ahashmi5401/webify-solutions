import { prisma } from '@/lib/prisma';

export async function getServices(includeInactive = false) {
  const where = includeInactive ? {} : { isActive: true };

  return prisma.service.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug },
  });
}
