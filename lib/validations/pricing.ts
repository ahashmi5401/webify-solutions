import { z } from 'zod';

export const pricingPlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  price: z.number().min(0, 'Price must be non-negative'),
  billingCycle: z.string().min(1, 'Billing cycle is required').max(50),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  isPopular: z.boolean().default(false),
  order: z.number().int().nonnegative('Order must be a non-negative integer'),
});

export const updatePricingPlanSchema = pricingPlanSchema.partial();

export type PricingPlanInput = z.infer<typeof pricingPlanSchema>;
export type UpdatePricingPlanInput = z.infer<typeof updatePricingPlanSchema>;
