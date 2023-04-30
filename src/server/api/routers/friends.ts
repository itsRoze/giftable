import { type User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';
import { formatUsersWithAvatars } from '~/server/helpers/formatUsersWithAvatars';
import { getUserAvatar } from '~/server/helpers/getUserAvater';
import { sortFriendsByBirthday } from '~/server/helpers/sortFriendsByBirthday';

dayjs.extend(isBetween);

export const friendsRouter = createTRPCRouter({
  getUpcomingBirthdays: privateProcedure.query(async ({ ctx }) => {
    // Get Friends
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
          },
          {
            status: 'ACCEPTED',
          },
        ],
      },
      select: {
        users: {
          where: {
            id: {
              not: ctx.user.id,
            },
          },
        },
      },
    });

    const friends = friendshipData
      .map((friendship) => friendship.users[0])
      .filter((friend): friend is User => friend !== undefined);

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
      const avatarUrl = await getUserAvatar(friend.authId);
      friendsWithAvatar.push({
        ...friend,
        avatarUrl: avatarUrl ?? '',
      });
    }
    return {
      friends: friendsWithAvatar,
    };
  }),
  getBirthdays: privateProcedure.query(async ({ ctx }) => {
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: ctx.user.id,
              },
            },
          },
          {
            status: 'ACCEPTED',
          },
        ],
      },
      select: {
        users: {
          where: {
            id: {
              not: ctx.user.id,
            },
          },
        },
      },
    });

    const friends = friendshipData
      .map((friendship) => friendship.users[0])
      .filter((friend): friend is User => friend !== undefined);

    const friendsWithAvatar = await formatUsersWithAvatars(friends);
    return sortFriendsByBirthday(friendsWithAvatar);
  }),
  getFriendStatus: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const friendshipData = await ctx.prisma.friend.findFirst({
        where: {
          OR: [
            {
              requestedId: input,
              requesterId: ctx.user.id,
            },
            {
              requestedId: ctx.user.id,
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
  getFriends: privateProcedure.query(async ({ ctx }) => {
    const friends: User[] = [];
    const friendshipData = await ctx.prisma.friend.findMany({
      where: {
        AND: [
          {
            users: {
              some: {
                id: ctx.user.id,
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
          friendship.users[0]?.id !== ctx.user.id
            ? friendship.users[0]
            : friendship.users[1]
        );
      }
    }

    return friends;
  }),
  getFriendRequests: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
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

    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const requesters = user.receivedFriendRequests.map((req) => req.requester);
    const requestersWithAvatars = await formatUsersWithAvatars(requesters);

    return requestersWithAvatars;
  }),
  getFriendReqCount: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.friend.count({
      where: {
        requestedId: ctx.user.id,
        status: 'PENDING',
      },
    });
  }),
  sendFriendRequest: privateProcedure
    .input(z.object({ requestedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          friends: {
            create: {
              requestedId: input.requestedId,
              requesterId: ctx.user.id,
              status: 'PENDING',
            },
          },
        },
      });
    }),
  acceptFriendRequest: privateProcedure
    .input(z.object({ requesterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          friends: {
            connect: {
              requesterId_requestedId: {
                requesterId: input.requesterId,
                requestedId: ctx.user.id,
              },
            },
            update: {
              where: {
                requesterId_requestedId: {
                  requesterId: input.requesterId,
                  requestedId: ctx.user.id,
                },
              },
              data: {
                requesterId: input.requesterId,
                requestedId: ctx.user.id,
                status: 'ACCEPTED',
              },
            },
          },
        },
      });
    }),
  declineFriendRequest: privateProcedure
    .input(z.object({ requesterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.friend.delete({
        where: {
          requesterId_requestedId: {
            requesterId: input.requesterId,
            requestedId: ctx.user.id,
          },
        },
      });
    }),
  cancelFriendRequest: privateProcedure
    .input(z.object({ requestedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.friend.delete({
        where: {
          requesterId_requestedId: {
            requesterId: ctx.user.id,
            requestedId: input.requestedId,
          },
        },
      });
    }),
  removeFriend: privateProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.friend.deleteMany({
        where: {
          OR: [
            {
              requestedId: input.friendId,
              requesterId: ctx.user.id,
            },
            {
              requestedId: ctx.user.id,
              requesterId: input.friendId,
            },
          ],
        },
      });
    }),
});
