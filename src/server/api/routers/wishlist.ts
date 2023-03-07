import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { createFakeItems } from '../../../lib/helpers';

export const wishlistRouter = createTRPCRouter({
  getMyItems: publicProcedure.input(z.number()).query(({ input }) => {
    return {
      items: createFakeItems(input),
    };
  }),
});
