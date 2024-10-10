import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { totalLuck } from "@/server/util";

const DIFFICULTY_MULTIPLIER = 1.18;
const COOLDOWN_DURATION = 2000;
const BASE_COST = 95;

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.db.user.findMany({
        take: 10,
        orderBy: [{ experience: "desc" }, { luck: "desc" }, { money: "desc" }],
        include: {
          swords: true,
        },
        where: {
          luck: { not: BigInt(1) || 1 },
        },
      });

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
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
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    return await totalLuck(user);
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
            lastLuckUpgrade: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Check cooldown
        const now = new Date();
        const timeSinceLastUpgrade = user.lastLuckUpgrade
          ? now.getTime() - user.lastLuckUpgrade.getTime()
          : COOLDOWN_DURATION;

        if (timeSinceLastUpgrade < COOLDOWN_DURATION) {
          const remainingTime = Math.ceil(
            (COOLDOWN_DURATION - timeSinceLastUpgrade) / 1000,
          );
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Please wait ${remainingTime} seconds before upgrading luck again`,
            cause: { remainingTime },
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
            money: { decrement: totalCost },
            luck: { increment: luckIncrement },
            lastLuckUpgrade: now,
          },
        });

        return {
          user: updatedUser,
          cost: totalCost,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
          cause: error,
        });
      }
    }),
});
