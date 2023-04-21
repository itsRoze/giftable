import { friendsRouter } from '~/server/api/routers/friends';
import { createTRPCRouter } from '~/server/api/trpc';
import { userRouter } from './routers/user';
import { wishlistRouter } from './routers/wishlist';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  friends: friendsRouter,
  user: userRouter,
  wishlist: wishlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
