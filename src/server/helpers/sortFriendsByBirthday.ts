import dayjs from 'dayjs';
import { type UserWithAvatar } from '~/lib/types';

export const sortFriendsByBirthday = (friends: UserWithAvatar[]) => {
  const today = dayjs();

  // Add days until next birthday to each friend
  const friendsWithNextBirthday = friends.map((friend) => {
    const birthday = dayjs(friend.birthday);

    // Calculate days until the next birthday
    let nextBirthday = birthday.year(today.year());

    // If the birthday has already passed, use next year
    if (nextBirthday.isBefore(today)) {
      nextBirthday = nextBirthday.add(1, 'year');
    }

    const daysUntilBirthday = nextBirthday.diff(today, 'days');

    return {
      ...friend,
      daysUntilBirthday,
      nextBirthday,
    };
  });

  // Sort friends by days until next nextBirthday
  const sortedFriends = friendsWithNextBirthday.sort((a, b) => {
    return a.daysUntilBirthday - b.daysUntilBirthday;
  });

  return sortedFriends;
};
