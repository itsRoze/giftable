import { z } from 'zod';

export const wishlistItemSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .transform((value) => value.trim()),
  url: z.optional(z.string().url().min(1).trim()),
});
