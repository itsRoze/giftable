import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { createFakeBirthdays } from '../../../lib/helpers';

export const friendsRouter = createTRPCRouter({
  getUpcomingBirthdays: publicProcedure.input(z.number()).query(({ input }) => {
    return {
      items: createFakeBirthdays(input),
    };
  }),
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        OR: [
          {
            requestedId: userId,
          },
          {
            requesterId: userId,
          },
        ],
      },
      include: {
        users: true,
      },
    });

    const arr = [];
    for (const friendship of friendshipData) {
      if (friendship.users[0] && friendship.users[1]) {
        arr.push(
          friendship.users[0]?.id !== userId
            ? friendship.users[0]
            : friendship.users[1]
        );
      }
    }

    return {
      friends: arr,
    };
  }),
});
