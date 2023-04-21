import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const wishlistRouter = createTRPCRouter({
  removeWishlistItem: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.wishlistItem.delete({
        where: {
          id: input.itemId,
        },
      });
    }),
});
