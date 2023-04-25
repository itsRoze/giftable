import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { giftIdeaSchema } from '~/lib/schemas/giftIdeaSchema';
import { userCreateSchema } from '~/lib/schemas/userCreateSchema';
import { wishlistItemSchema } from '~/lib/schemas/wishlistItemSchema';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { formatUsersWithAvatars } from '~/server/helpers/formatUsersWithAvatars';
import { getUserAvatar } from '~/server/helpers/getUserAvater';

export const userRouter = createTRPCRouter({
  getCurrentUserDetails: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        userId: ctx.userId,
      },
      select: {
        name: true,
        pronouns: true,
      },
    });
  }),
  getProfile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          wishlist: true,
          friendsGiftIdeas: {
            where: {
              giftFromUserId: ctx.userId,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const userWithAvatar = {
        ...user,
        avatarUrl: await getUserAvatar(user.userId),
      };

      if (!userWithAvatar) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to dd user avar to profile',
        });
      }

      // filter for client
      const {
        avatarUrl,
        id,
        pronouns,
        birthday,
        name,
        wishlist,
        friendsGiftIdeas,
      } = userWithAvatar;

      return {
        avatarUrl,
        id,
        pronouns,
        birthday,
        name,
        wishlist,
        friendsGiftIdeas,
      };
    }),
  getWishlistForCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        userId: ctx.userId,
      },
      select: {
        wishlist: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return user?.wishlist || [];
  }),
  addToWishlistForCurrentUser: protectedProcedure
    .input(wishlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          userId: ctx.userId,
        },
        data: {
          wishlist: {
            create: {
              name: input.name,
              description: input.description,
              url: input.url,
              imageUrl: input.imageUrl,
            },
          },
        },
        select: {
          wishlist: true,
        },
      });

      // return last item in wishlist
      return user.wishlist[user.wishlist.length - 1];
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
  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!input) {
      return [];
    }
    const users = await ctx.prisma.user.findMany({
      where: {
        name: {
          contains: input,
        },
      },
    });

    return formatUsersWithAvatars(users);
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
