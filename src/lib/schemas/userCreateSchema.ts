import { z } from 'zod';

export const nameSchema = z
  .string()
  .min(1, "Name can't be empty")
  .max(40, "Name can't be longer than 40 characters")
  .refine((value) => value.trim(), 'Name can not be empty');

export const pronounsSchema = z
  .string()
  .min(1, "Pronouns can't be empty")
  .max(40, "Pronouns can't be longer than 40 characters")
  .refine((value) => value.trim(), 'Pronouns can not be empty');

export const birthdaySchema = z.date().refine((value) => {
  // at least 13 years old
  const now = new Date();
  const diff = now.getTime() - value.getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970) >= 13;
}, 'You must be at least 13 years old');

export const userCreateSchema = z.object({
  name: nameSchema,
  pronouns: pronounsSchema,
  birthday: birthdaySchema,
});
