import { type User } from '@prisma/client';

export interface UserWithAvatar extends User {
  avatarUrl: string;
}
