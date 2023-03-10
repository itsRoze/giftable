import { prisma } from '~/server/db';
import { userNames } from './data.js';

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

async function main() {
  await createUsers();
  await createFriends();
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
