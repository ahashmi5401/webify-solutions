import { z } from 'zod';

export const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(200).optional(),
  siteDescription: z.string().max(500).optional(),
  contactEmail: z.string().email('Invalid email address').optional(),
  maintenanceMode: z.boolean().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
