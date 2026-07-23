import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const newsletterQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  isActive: z.string().optional().transform((val) => val === 'true'),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UnsubscribeInput = z.infer<typeof unsubscribeSchema>;
export type NewsletterQuery = z.infer<typeof newsletterQuerySchema>;
