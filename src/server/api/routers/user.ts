import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { giftIdeaSchema } from '~/lib/schemas/giftIdeaSchema';
import { userCreateSchema } from '~/lib/schemas/userCreateSchema';
import { wishlistItemSchema } from '~/lib/schemas/wishlistItemSchema';

import {
  createTRPCRouter,
  privateProcedure,
  protectedProcedure,
} from '~/server/api/trpc';
import { formatUsersWithAvatars } from '~/server/helpers/formatUsersWithAvatars';
import { getUserAvatar } from '~/server/helpers/getUserAvater';

export const userRouter = createTRPCRouter({
  getCurrentUserDetails: privateProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        name: true,
        pronouns: true,
      },
    });

    if (!userDetails) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return userDetails;
  }),
  updateUserDetails: privateProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: input,
      });
    }),
  getProfile: privateProcedure
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
              giftFromUserId: ctx.user.id,
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
        avatarUrl: await getUserAvatar(user.authId),
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
        authId,
        id,
        pronouns,
        birthday,
        name,
        wishlist,
        friendsGiftIdeas,
      } = userWithAvatar;

      return {
        avatarUrl,
        authId,
        id,
        pronouns,
        birthday,
        name,
        wishlist,
        friendsGiftIdeas,
      };
    }),
  getWishlistForCurrentUser: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
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
  addToWishlistForCurrentUser: privateProcedure
    .input(wishlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
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
  getGiftIdeasForCurrentUser: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        myGiftIdeas: true,
      },
    });
  }),
  getGiftIdeasForFriend: privateProcedure
    .input(z.object({ friendId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.friendId,
        },
        select: {
          friendsGiftIdeas: {
            where: {
              giftFromUserId: ctx.user.id,
            },
          },
        },
      });
    }),
  addGiftIdea: privateProcedure
    .input(giftIdeaSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          myGiftIdeas: {
            create: {
              name: input.name,
              description: input.description,
              url: input.url,
              imageUrl: input.imageUrl,
              giftToUserId: input.giftToUserId,
            },
          },
        },
        select: {
          myGiftIdeas: true,
        },
      });

      return user.myGiftIdeas[user.myGiftIdeas.length - 1];
    }),
  find: privateProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
  create: protectedProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          birthday: input.birthday,
          pronouns: input.pronouns,
          authId: ctx.user.authId,
        },
      });

      return user;
    }),
});
