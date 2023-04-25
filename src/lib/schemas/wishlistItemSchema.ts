import { z } from 'zod';
import { isSupportedExtension } from '~/server/helpers/isSupportedExtension';

export const wishlistItemSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(80, 'Name must be 80 characters or less')
    .transform((value) => value.trim()),
  description: z
    .string()
    .max(300, 'Description must be 300 characters or less'),
  url: z.string().url().or(z.literal('')).optional(),
  imageUrl: z
    .string()
    .url()
    .refine((url) => isSupportedExtension(url), {
      message: 'URL must end with .jpg, .jpeg, .png, or .svg',
    })
    .or(z.literal(''))
    .optional(),
});
