import * as z from 'zod';

export const giftIdeaSchema = z.object({
  giftToUserId: z.string().min(1),
  name: z
    .string()
    .min(1)
    .max(50)
    .transform((value) => value.trim()),
  url: z.optional(z.string().url().min(1).trim()),
});
