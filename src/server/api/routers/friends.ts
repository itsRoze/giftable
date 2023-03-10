import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { createFakeBirthdays, createFakeFriends } from '../../../lib/helpers';

export const friendsRouter = createTRPCRouter({
  getUpcomingBirthdays: publicProcedure.input(z.number()).query(({ input }) => {
    return {
      items: createFakeBirthdays(input),
    };
  }),
  getFriends: protectedProcedure.query(() => {
    return {
      friends: createFakeFriends(),
    };
  }),
});
