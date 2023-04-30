import { z } from 'zod';
import { updateGiftIdeaSchema } from '~/lib/schemas/updateGiftIdeaSchema';

import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';

export const giftRouter = createTRPCRouter({
  remove: privateProcedure
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.giftIdea.delete({
        where: {
          id: input.itemId,
        },
      });
    }),
  update: privateProcedure
    .input(updateGiftIdeaSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.giftIdea.update({
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
