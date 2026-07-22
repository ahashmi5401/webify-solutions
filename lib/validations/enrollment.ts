import { z } from 'zod';

export const enrollmentSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
  turnstileToken: z.string().min(1, 'Turnstile token is required'),
});

export const updateEnrollmentSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED']),
  progressJson: z.any().optional(),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
