import { z } from 'zod';

const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  content: z.string().min(1, 'Lesson content is required'),
  videoUrl: z.string().url().nullable().optional().or(z.literal('')),
  order: z.number().int().nonnegative(),
  isFreePreview: z.boolean().default(false),
});

const moduleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  order: z.number().int().nonnegative(),
  lessons: z.array(lessonSchema).default([]),
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  price: z.number().min(0, 'Price must be non-negative'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required').max(100),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  isPublished: z.boolean().default(false),
  modules: z.array(moduleSchema).default([]),
});

export const updateCourseSchema = courseSchema.omit({ modules: true }).partial();

export const courseQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  category: z.string().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  search: z.string().optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQuery = z.infer<typeof courseQuerySchema>;
