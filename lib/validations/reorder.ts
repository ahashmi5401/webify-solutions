import { z } from 'zod';

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().cuid('Invalid ID'),
      order: z.number().int('Order must be an integer').min(0, 'Order must be non-negative'),
    })
  ).min(1, 'At least one item is required'),
});

export type ReorderInput = z.infer<typeof reorderSchema>;
