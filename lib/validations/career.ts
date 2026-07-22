import { z } from 'zod';

export const careerListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  department: z.string().min(2, 'Department must be at least 2 characters').max(100),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  isActive: z.boolean().default(true),
});

export const updateCareerListingSchema = careerListingSchema.partial();

export const careerQuerySchema = z.object({
  department: z.string().optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
  location: z.string().optional(),
});

export type CareerListingInput = z.infer<typeof careerListingSchema>;
export type UpdateCareerListingInput = z.infer<typeof updateCareerListingSchema>;
export type CareerQuery = z.infer<typeof careerQuerySchema>;
