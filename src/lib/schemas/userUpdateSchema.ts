import { z } from 'zod';

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .email()
    .optional()
    .transform((val) => val?.trim()),
  emailVerified: z.date().optional(),
  birthday: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;

      const parsedDate = new Date(val);
      if (val && isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const now = new Date();
      const minAgeDate = new Date(
        now.getFullYear() - 13,
        now.getMonth(),
        now.getDate()
      );
      return parsedDate < minAgeDate;
    }, 'User birthdate must be at least 13 years ago'),
  pronouns: z.string().optional(),
});
