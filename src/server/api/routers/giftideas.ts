import { giftIdeaSchema } from '~/lib/schemas/giftIdeaSchema';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const giftIdeasRouter = createTRPCRouter({
  addGiftForUser: protectedProcedure
    .input(giftIdeaSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          myGiftIdeas: {
            create: {
              name: input.name,
              url: input.url,
              giftToUserId: input.giftToUserId,
            },
          },
        },
      });
    }),
  getMyGiftIdeas: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        myGiftIdeas: true,
      },
    });
  }),
});
