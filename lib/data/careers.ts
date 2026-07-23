import { prisma } from '@/lib/prisma';

export interface CareerQueryParams {
  department?: string;
  type?: string;
  location?: string;
}

export async function getCareerListings(params: CareerQueryParams = {}) {
  const { department, type, location } = params;

  const where: any = { isActive: true };

  if (department) {
    where.department = department;
  }

  if (type) {
    where.type = type;
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  return prisma.careerListing.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}
