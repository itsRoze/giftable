import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { prisma } from '~/server/db';
import { appRouter } from '../api/root';

export const generateSSHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, user: { authId: '', id: '' } },
    transformer: superjson, // optional - adds superjson serialization
  });
