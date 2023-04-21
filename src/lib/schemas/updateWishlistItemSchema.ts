import { z } from 'zod';
import { isSupportedExtension } from '~/server/helpers/isSupportedExtension';

export const updateWishlistItemSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1)
    .max(50, 'Name must be 50 characters or less')
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
