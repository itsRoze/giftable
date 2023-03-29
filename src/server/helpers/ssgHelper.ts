import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';

export const generateSSGHelper = () =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson, // optional - adds superjson serialization
  });
