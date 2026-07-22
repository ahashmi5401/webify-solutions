import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UnsubscribeInput = z.infer<typeof unsubscribeSchema>;
