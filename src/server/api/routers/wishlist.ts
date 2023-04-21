import { z } from 'zod';
import { updateWishlistItemSchema } from '~/lib/schemas/updateWishlistItemSchema';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const wishlistRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.wishlistItem.delete({
        where: {
          id: input.itemId,
        },
      });
    }),
  update: protectedProcedure
    .input(updateWishlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.wishlistItem.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          url: input.url,
          imageUrl: input.imageUrl,
        },
      });
    }),
});
