import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  source: z.enum(['COURSE', 'SERVICE', 'CONTACT', 'CAREER']),
  turnstileToken: z.string().min(1, 'Turnstile token is required'),
});

export const updateInquirySchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
