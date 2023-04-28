import { env } from '~/env.mjs';
import { type User } from '~/lib/clerk.types';

export const getUserAvatar = async (authId: string | null) => {
  if (!authId) return 'http://www.gravatar.com/avatar/?d=mp';
  try {
    const url = `https://api.clerk.dev/v1/users/${authId}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
      },
    });

    const data = (await res.json()) as User;
    return data.profile_image_url;
  } catch (error) {
    return 'http://www.gravatar.com/avatar/?d=mp';
  }
};
