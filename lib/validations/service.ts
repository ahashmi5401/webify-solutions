import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  priceRange: z.string().max(100).optional(),
  icon: z.string().max(100).optional(),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = serviceSchema.partial();

export type ServiceInput = z.infer<typeof serviceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
