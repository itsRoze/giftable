import { z } from 'zod';

export const userDetailsSchema = z.object({
  name: z
    .string()
    .min(1, "Name can't be empty")
    .max(40, "Name can't be longer than 40 characters")
    .transform((value) => value.trim()),
  pronouns: z
    .string()
    .min(1, "Pronouns can't be empty")
    .max(40, "Pronouns can't be longer than 40 characters")
    .transform((value) => value.trim()),
});
