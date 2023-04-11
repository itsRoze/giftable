import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .transform((value) => value.trim()),
  email: z.string().email().min(1).trim(),
  password: z.string().min(8).max(50),
  birthdate: z.string().refine((value) => {
    const parsedDate = new Date(value);
    if (value && isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }

    // at least 13 years old
    const now = new Date();
    const diff = now.getTime() - parsedDate.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970) >= 13;
  }),
  pronouns: z
    .string()
    .min(1)
    .max(50)
    .transform((value) => value.trim()),
  emailVerified: z.date().optional(),
});
