import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { createFakeBirthdays } from '../../../lib/helpers';

export const friendsRouter = createTRPCRouter({
  getUpcomingBirthdays: publicProcedure.input(z.number()).query(({ input }) => {
    return {
      items: createFakeBirthdays(input),
    };
  }),
});
