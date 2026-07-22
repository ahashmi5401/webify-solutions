import { z } from 'zod';

export const moduleSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  order: z.number().int().positive('Order must be a positive integer'),
});

export const updateModuleSchema = moduleSchema.partial().omit({ courseId: true });

export type ModuleInput = z.infer<typeof moduleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
