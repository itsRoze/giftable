import { z } from 'zod';
import { giftIdeaSchema } from '~/lib/schemas/giftIdeaSchema';
import { wishlistItemSchema } from '~/lib/schemas/wishlistItemSchema';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  getProfileForCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
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
            giftFromUserId: ctx.session.user.id,
          },
        },
      },
    });
  }),
  getWishlistForCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
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
          id: ctx.session.user.id,
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
        id: ctx.session.user.id,
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
              giftFromUserId: ctx.session.user.id,
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
            mode: 'insensitive',
          },
        },
      });
    }),
});
