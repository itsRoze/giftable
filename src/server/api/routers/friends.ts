import { type User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import moment from 'moment';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const friendsRouter = createTRPCRouter({
  getUpcomingBirthdays: protectedProcedure.query(async ({ ctx }) => {
    // Get Friends
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        OR: [
          {
            requestedId: ctx.userId,
          },
          {
            requesterId: ctx.userId,
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
          friendship.users[0]?.id !== ctx.userId
            ? friendship.users[0]
            : friendship.users[1]
        );
      }
    }

    // Get friends whose birthday is within the next two months
    const upcomingBirthdays = arr
      .filter((friend) => {
        const today = moment().startOf('day');
        const twoMonthsFromToday = moment().add(2, 'months').endOf('day');

        const birthday = moment(friend.birthday)
          .startOf('day')
          .year(today.year());
        console.log(birthday.toString());

        return birthday.isBetween(today, twoMonthsFromToday, 'day', '[]');
      })
      .sort((a, b) => {
        const today = moment().startOf('day');
        const birthdayA = moment(a.birthday).startOf('day').year(today.year());
        const birthdayB = moment(b.birthday).startOf('day').year(today.year());

        return birthdayA.diff(birthdayB, 'days');
      });

    // use moment to get difference in days and ignore years

    return {
      friends: upcomingBirthdays,
    };
  }),
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const friends: User[] = [];
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                userId: ctx.userId,
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

    console.log();

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
