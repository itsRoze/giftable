import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      include: {
        wishlist: true,
        friendsGiftIdeas: true,
      },
    });
  }),

  getFriendRelation: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const friendshipData = await ctx.prisma.friend.findFirst({
        where: {
          OR: [
            {
              requestedId: input,
              requesterId: ctx.session.user.id,
            },
            {
              requestedId: ctx.session.user.id,
              requesterId: input,
            },
          ],
        },
      });

      return {
        status: friendshipData?.status,
      };
    }),
  findUsers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!input) {
        return [];
      }
      return ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input,
            mode: 'insensitive',
          },
        },
      });
    }),
});
