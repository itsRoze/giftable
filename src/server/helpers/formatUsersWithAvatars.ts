import { type User } from '@prisma/client';
import { getUserAvatar } from './getUserAvater';

export const formatUsersWithAvatars = async (users: User[]) => {
  const usersWithAvatars = [];
  for (const user of users) {
    const avatarUrl = await getUserAvatar(user.userId);
    usersWithAvatars.push({
      ...user,
      avatarUrl: avatarUrl ?? '',
    });
  }

  return usersWithAvatars;
};
