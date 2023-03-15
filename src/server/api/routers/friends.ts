import moment from 'moment';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const friendsRouter = createTRPCRouter({
  getUpcomingBirthdays: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get Friends
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        OR: [
          {
            requestedId: userId,
          },
          {
            requesterId: userId,
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
          friendship.users[0]?.id !== userId
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
    const userId = ctx.session.user.id;

    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: userId,
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

    const arr = [];
    for (const friendship of friendshipData) {
      if (friendship.users[0] && friendship.users[1]) {
        arr.push(
          friendship.users[0]?.id !== userId
            ? friendship.users[0]
            : friendship.users[1]
        );
      }
    }

    return {
      friends: arr,
    };
  }),
  getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
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
      const userId = ctx.session.user.id;

      return await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            create: {
              requestedId: input.requestedId,
              requesterId: userId,
              status: 'PENDING',
            },
          },
        },
      });
    }),
  acceptFriendRequest: protectedProcedure
    .input(z.object({ requesterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            connect: {
              requesterId_requestedId: {
                requesterId: input.requesterId,
                requestedId: userId,
              },
            },
            update: {
              where: {
                requesterId_requestedId: {
                  requesterId: input.requesterId,
                  requestedId: userId,
                },
              },
              data: {
                requesterId: input.requesterId,
                requestedId: userId,
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
      const userId = ctx.session.user.id;

      return await ctx.prisma.friend.delete({
        where: {
          requesterId_requestedId: {
            requesterId: input.requesterId,
            requestedId: userId,
          },
        },
      });
    }),
  cancelFriendRequest: protectedProcedure
    .input(z.object({ requestedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return await ctx.prisma.friend.delete({
        where: {
          requesterId_requestedId: {
            requesterId: userId,
            requestedId: input.requestedId,
          },
        },
      });
    }),
});
