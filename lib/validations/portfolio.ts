import { z } from 'zod';

export const portfolioSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  thumbnailUrl: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),
  techUsed: z.array(z.string()).min(1, 'At least one technology is required'),
  resultsSummary: z.string().min(10, 'Results summary must be at least 10 characters').max(2000),
  clientTestimonial: z.string().max(1000).optional(),
  isPublished: z.boolean().default(false),
});

export const updatePortfolioSchema = portfolioSchema.partial();

export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
