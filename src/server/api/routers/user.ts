import { z } from 'zod';
import { giftIdeaSchema } from '~/lib/schemas/giftIdeaSchema';
import { userCreateSchema } from '~/lib/schemas/userCreateSchema';
import { wishlistItemSchema } from '~/lib/schemas/wishlistItemSchema';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  getProfileForCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
      select: {
        name: true,
        receivedFriendRequests: {
          where: {
            status: 'PENDING',
          },
        },
        wishlist: true,
      },
    });
  }),
  getProfile: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      select: {
        birthday: true,
        pronouns: true,
        name: true,
        wishlist: true,
        friendsGiftIdeas: {
          where: {
            giftFromUserId: ctx.userId,
          },
        },
      },
    });
  }),
  getWishlistForCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        userId: ctx.userId,
      },
      select: {
        wishlist: true,
      },
    });

    return user?.wishlist || [];
  }),
  addToWishlistForCurrentUser: protectedProcedure
    .input(wishlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.userId,
        },
        data: {
          wishlist: {
            create: {
              name: input.name,
              url: input.url,
            },
          },
        },
      });
    }),
  getGiftIdeasForCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
      select: {
        myGiftIdeas: true,
      },
    });
  }),
  getGiftIdeasForFriend: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.friendId,
        },
        select: {
          friendsGiftIdeas: {
            where: {
              giftFromUserId: ctx.userId,
            },
          },
        },
      });
    }),
  addGiftIdea: protectedProcedure
    .input(giftIdeaSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.userId,
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
  getFriendRelation: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const friendshipData = await ctx.prisma.friend.findFirst({
        where: {
          OR: [
            {
              requestedId: input,
              requesterId: ctx.userId,
            },
            {
              requestedId: ctx.userId,
              requesterId: input,
            },
          ],
        },
      });

      return {
        status: friendshipData?.status,
        requestedId: friendshipData?.requestedId,
        requesterId: friendshipData?.requesterId,
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
          },
        },
      });
    }),
  create: publicProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          birthday: new Date(input.birthdate),
          pronouns: input.pronouns,
          emailVerified: input.emailVerified,
        },
      });

      return user;
    }),
  setEmailVerified: protectedProcedure
    .input(z.object({ email: z.string().email(), emailVerified: z.date() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          emailVerified: input.emailVerified,
          userId: ctx.userId,
        },
      });
    }),
  getMe: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      console.log('NO USERID');
      return null;
    }

    console.log('Gonna find some more info for ', ctx.userId);

    const data = await ctx.prisma.user.findUnique({
      where: {
        userId: ctx.userId,
      },
    });

    console.log('Found data', data);

    return ctx.userId;
  }),
});
