import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const giftIdeasRouter = createTRPCRouter({
  addGiftForUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        giftName: z.string(),
        giftUrl: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          myGiftIdeas: {
            create: {
              name: input.giftName,
              url: input.giftUrl,
              giftToUserId: input.userId,
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
