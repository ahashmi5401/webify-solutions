import { z } from 'zod';

export const mediaQuerySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 10),
  type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).optional(),
});

export type MediaQuery = z.infer<typeof mediaQuerySchema>;
