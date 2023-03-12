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

const makeUser = (name: string) => {
  return {
    name,
    email: `${name.toLowerCase().replace(' ', '')}@gmail.com`,
    birthday: randomDate(),
  };
};

const createUsers = async () => {
  await prisma.user.deleteMany();

  for (const name of userNames) {
    const user = makeUser(name);

    await prisma.user.create({
      data: user,
    });
  }
};

// Create Friends
const createFriends = async () => {
  const jessicaUser = await prisma.user.findUnique({
    where: {
      email: 'jessicahart@gmail.com',
    },
  });

  if (!jessicaUser) return;

  const jessicaId = jessicaUser.id;
  const allUsers = await prisma.user.findMany();

  for (const user of allUsers) {
    if (user.id === jessicaId) continue;

    await prisma.user.update({
      where: {
        email: 'jessicahart@gmail.com',
      },
      data: {
        friends: {
          create: {
            requestedId: user.id,
            requesterId: jessicaId,
            status: 'accepted',
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        email: user.email as string,
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

  console.log(jessicaUser);
};

// Create Wishlist
const createWishlist = async () => {
  for (const item of wishlist) {
    await prisma.user.update({
      where: {
        email: 'jessicahart@gmail.com',
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
