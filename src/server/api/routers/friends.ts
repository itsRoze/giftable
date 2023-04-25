import { type User } from '@prisma/client';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { getUserAvatar } from '~/server/helpers/getUserAvater';

dayjs.extend(isBetween);

export const friendsRouter = createTRPCRouter({
  getUpcomingBirthdays: protectedProcedure.query(async ({ ctx }) => {
    // Get Friends
    const friends: User[] = [];
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: ctx.userId,
              },
            },
          },
          {
            status: 'ACCEPTED',
          },
        ],
      },
      select: {
        users: true,
      },
    });

    for (const friendship of friendshipData) {
      if (friendship.users[0] && friendship.users[1]) {
        friends.push(
          friendship.users[0]?.id !== ctx.userId
            ? friendship.users[0]
            : friendship.users[1]
        );
      }
    }

    // Get friends whose birthday is within the next two months
    const filteredFriends = friends
      .filter((friend) => {
        const today = dayjs().startOf('day');
        const twoMonthsFromToday = dayjs().add(2, 'months').endOf('day');

        const birthday = dayjs(friend.birthday)
          .startOf('day')
          .year(today.year());

        // use dayjs to see if birthday is between today and two months from today
        return birthday.isBetween(today, twoMonthsFromToday, 'day', '[]');
      })
      .sort((a, b) => {
        const today = dayjs().startOf('day');
        const birthdayA = dayjs(a.birthday).startOf('day').year(today.year());
        const birthdayB = dayjs(b.birthday).startOf('day').year(today.year());

        return birthdayA.diff(birthdayB, 'days');
      });

    // Add user avatar
    const friendsWithAvatar = [];
    for (const friend of filteredFriends) {
      const avatarUrl = await getUserAvatar(friend.userId);
      friendsWithAvatar.push({
        ...friend,
        avatarUrl: avatarUrl ?? '',
      });
    }
    return {
      friends: friendsWithAvatar,
    };
  }),
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const friends: User[] = [];
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: ctx.userId,
              },
            },
          },
          {
            status: 'ACCEPTED',
          },
        ],
      },
      include: {
        users: true,
      },
    });

    for (const friendship of friendshipData) {
      if (friendship.users[0] && friendship.users[1]) {
        friends.push(
          friendship.users[0]?.id !== ctx.userId
            ? friendship.users[0]
            : friendship.users[1]
        );
      }
    }

    return friends;
  }),
  getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        receivedFriendRequests: {
          where: {
            status: 'PENDING',
          },
          include: {
            requester: true,
          },
        },
      },
    });
  }),
  sendFriendRequest: protectedProcedure
    .input(z.object({ requestedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.userId,
        },
        data: {
          friends: {
            create: {
              requestedId: input.requestedId,
              requesterId: ctx.userId,
              status: 'PENDING',
            },
          },
        },
      });
    }),
  acceptFriendRequest: protectedProcedure
    .input(z.object({ requesterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.userId,
        },
        data: {
          friends: {
            connect: {
              requesterId_requestedId: {
                requesterId: input.requesterId,
                requestedId: ctx.userId,
              },
            },
            update: {
              where: {
                requesterId_requestedId: {
                  requesterId: input.requesterId,
                  requestedId: ctx.userId,
                },
              },
              data: {
                requesterId: input.requesterId,
                requestedId: ctx.userId,
                status: 'ACCEPTED',
              },
            },
          },
        },
      });
    }),
  declineFriendRequest: protectedProcedure
    .input(z.object({ requesterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.friend.delete({
        where: {
          requesterId_requestedId: {
            requesterId: input.requesterId,
            requestedId: ctx.userId,
          },
        },
      });
    }),
  cancelFriendRequest: protectedProcedure
    .input(z.object({ requestedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.friend.delete({
        where: {
          requesterId_requestedId: {
            requesterId: ctx.userId,
            requestedId: input.requestedId,
          },
        },
      });
    }),
});
