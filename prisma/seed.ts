import { prisma } from '~/server/db';
import { userNames, wishlist } from './data.js';

//  Create Users
const randomDate = () => {
  const start = new Date(1970, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

type User = {
  name: string;
  authId: string;
};
const makeUser = (user: User) => {
  // Random user pronouns
  const pronouns = ['she/her', 'he/him', 'they/them', 'ze/zir', 'any/all'];
  const randomPronouns = pronouns[
    Math.floor(Math.random() * pronouns.length)
  ] as string;

  return {
    name: user.name,
    pronouns: randomPronouns,
    birthday: randomDate(),
    authId: user.authId,
  };
};

const createUsers = async () => {
  await prisma.user.deleteMany();

  const users = [];
  for (const name of userNames) {
    const user = makeUser(name);
    users.push(user);
  }

  await prisma.user.createMany({
    data: users,
  });
};

// Create Friends
const createFriends = async () => {
  const jessicaUser = await prisma.user.findUnique({
    where: {
      authId: 'user_2OQe99wUvxqPvH8ZbQrkQF4oqcP',
    },
  });

  if (!jessicaUser) return;

  const jessicaId = jessicaUser.id;
  const allUsers = await prisma.user.findMany();

  let count = 0;
  for (const user of allUsers) {
    if (user.id === jessicaId) continue;
    count++;

    if (count > 6) break;
    await prisma.user.update({
      where: {
        authId: 'user_2OQe99wUvxqPvH8ZbQrkQF4oqcP',
      },
      data: {
        friends: {
          create: {
            requestedId: user.id,
            requesterId: jessicaId,
            status: 'ACCEPTED',
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        authId: user.authId,
      },
      data: {
        friends: {
          connect: {
            requesterId_requestedId: {
              requestedId: user.id,
              requesterId: jessicaId,
            },
          },
        },
      },
    });
  }
};

// Create Wishlist
const createWishlist = async () => {
  // Get all users
  const users = await prisma.user.findMany();
  for (const user of users) {
    // Get two random items from wishlist
    const randomItems = wishlist.sort(() => Math.random() - 0.5).slice(0, 2);

    // Create wishlist items for each user
    for (const item of randomItems) {
      await prisma.user.update({
        where: {
          authId: user.authId,
        },
        data: {
          wishlist: {
            create: {
              name: item.name,
              url: item.url,
            },
          },
        },
      });
    }
  }
};

async function main() {
  await createUsers();
  await createFriends();
  await createWishlist();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
