import { wishlistItemSchema } from '~/lib/schemas/wishlistItemSchema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const wishlistRouter = createTRPCRouter({
  getMyItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userData = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wishlist: true,
      },
    });

    return {
      items: userData?.wishlist || [],
    };
  }),
  createItem: protectedProcedure
    .input(wishlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          wishlist: {
            create: {
              name: input.name,
              url: input.url,
            },
          },
        },
      });
    }),
});
