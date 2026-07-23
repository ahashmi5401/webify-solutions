import { prisma } from '@/lib/prisma';

export async function getPricingPlans() {
  return prisma.pricingPlan.findMany({
    orderBy: [{ order: 'asc' }],
  });
}
