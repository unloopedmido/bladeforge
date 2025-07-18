import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { globalConfig, totalLuck } from "@/server/util";

const DIFFICULTY_MULTIPLIER = 1.18;
const COOLDOWN_DURATION = 2000;
const BASE_COST = 95;

const userCache = new Map<
  string,
  {
    lastLuckUpgrade?: Date;
  }
>();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userCache.entries()) {
    if (
      value.lastLuckUpgrade &&
      now - value.lastLuckUpgrade.getTime() > 3600000
    ) {
      userCache.delete(key);
    }
  }
}, 3600000);

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          experience: true,
        },
        where: {
          luck: { gt: 1 },
        },
        orderBy: [{ experience: "desc" }, { luck: "desc" }, { money: "desc" }],
      });

      return users;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        cause: error,
      });
    }
  }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          luck: true,
          money: true,
          experience: true,
          image: true,
          swordsGenerated: true,
          createdAt: true,
          vip: true,
        },
        where: {
          luck: { gt: 1 },
        },
        orderBy: [{ experience: "desc" }, { luck: "desc" }, { money: "desc" }],
      });

      const sortedUsers = users.sort((a, b) => {
        const expDiff = BigInt(b.experience) - BigInt(a.experience);
        if (expDiff !== BigInt(0)) return expDiff > BigInt(0) ? 1 : -1;

        const luckDiff = b.luck - a.luck;
        if (luckDiff !== BigInt(0)) return Number(luckDiff);

        return Number(b.money) - Number(a.money);
      });

      return sortedUsers.slice(0, 10);
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        cause: error,
      });
    }
  }),

  userTotalLuck: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        luck: true,
        swordId: true,
        experience: true,
        vip: true,
        swords: {
          select: { luck: true, id: true },
        },
      },
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    return await totalLuck(user);
  }),

  getUser: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // Check if user is authenticated
      const user = await ctx.db.user.findUnique({
        where: { id: input },
        select: {
          experience: true,
          image: true,
          name: true,
          id: true,
          money: true,
          luck: true,
          swordsGenerated: true,
          swords: true,
          vip: true,
          swordId: true,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      // Check if the user has a sword equipped
      if (user.swordId) {
        const sword = user.swords.find((s) => s.id === user.swordId);

        return {
          ...user,
          user: {
            sword,
          },
        };
      }

      return user;
    }),

  user: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is authenticated
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { swords: true },
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    return user;
  }),

  upgradeLuck: protectedProcedure
    .input(z.number().int().positive())
    .mutation(async ({ ctx, input: luckIncrement }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: {
            id: true,
            luck: true,
            money: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check cooldown
        const now = Date.now();
        const cachedUser = userCache.get(user.id);
        const lastLuckUpgrade = cachedUser?.lastLuckUpgrade?.getTime() ?? 0;

        if (lastLuckUpgrade && now - lastLuckUpgrade < COOLDOWN_DURATION) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Please wait ${((COOLDOWN_DURATION - (now - lastLuckUpgrade)) / 1000).toFixed(1)}s before generating a new sword`,
          });
        }

        const currentLuck = Number(user.luck);
        const currentMoney = Number(user.money);

        // Calculate total cost
        let totalCost = 0;
        for (let i = 0; i < luckIncrement; i++) {
          const incrementCost = Math.round(
            BASE_COST * Math.pow(DIFFICULTY_MULTIPLIER, currentLuck + i),
          );
          totalCost += incrementCost;
        }

        if (currentMoney < totalCost) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Insufficient funds. Required: $${totalCost}, Available: $${currentMoney}`,
          });
        }

        const updatedUser = await ctx.db.user.update({
          where: { id: user.id },
          data: {
            money: String(Math.round(parseInt(user.money) - totalCost)),
            luck: { increment: luckIncrement },
          },
        });

        userCache.set(user.id, {
          lastLuckUpgrade: new Date(),
        });

        return {
          user: updatedUser,
          cost: totalCost,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          cause: error,
        });
      }
    }),

  getGlobalBoosts: protectedProcedure.query(async () => {
    const config = await globalConfig();

    return config;
  }),
});
