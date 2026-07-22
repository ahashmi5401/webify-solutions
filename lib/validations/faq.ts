import { z } from 'zod';

export const faqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(500),
  answer: z.string().min(10, 'Answer must be at least 10 characters').max(2000),
  category: z.string().max(100).optional(),
  order: z.number().int().nonnegative('Order must be a non-negative integer'),
});

export const updateFaqSchema = faqSchema.partial();

export type FAQInput = z.infer<typeof faqSchema>;
export type UpdateFAQInput = z.infer<typeof updateFaqSchema>;
