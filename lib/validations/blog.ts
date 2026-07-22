import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url().optional(),
  authorId: z.string().cuid('Invalid author ID'),
  category: z.string().min(1, 'Category is required').max(100),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
});

export const updateBlogPostSchema = blogPostSchema.partial().omit({ authorId: true });

export const blogQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  includeUnpublished: z.string().optional().transform((val) => val === 'true'),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogQuery = z.infer<typeof blogQuerySchema>;
