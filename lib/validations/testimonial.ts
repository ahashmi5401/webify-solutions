import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100),
  company: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  avatarUrl: z.string().url().optional(),
  isPublished: z.boolean().default(false),
});

export const updateTestimonialSchema = testimonialSchema.partial();

export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
