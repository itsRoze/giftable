import { z } from 'zod';

const isSupportedExtension = (url: string) => {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.svg'];

  return supportedExtensions.some((ext) => url.endsWith(ext));
};

export const wishlistItemSchema = z.object({
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
