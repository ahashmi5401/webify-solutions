import { z } from 'zod';

export const lessonSchema = z.object({
  moduleId: z.string().cuid('Invalid module ID'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  videoUrl: z.string().url().optional(),
  order: z.number().int().positive('Order must be a positive integer'),
  isFreePreview: z.boolean().default(false),
});

export const updateLessonSchema = lessonSchema.partial().omit({ moduleId: true });

export type LessonInput = z.infer<typeof lessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
