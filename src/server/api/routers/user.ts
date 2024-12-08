import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const userCache = new Map<
  string,
  {
    lastLuckUpgrade?: Date;
  }
>();


export const userRouter = createTRPCRouter({
	profile: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: {
				id: true,
				name: true,
				image: true,
				luck: true,
				money: true,
				essence: true,
				stats: true,
				joinedAt: true,
				experience: true,
				currentSword: true,
				vip: true,
				swords: true,
			},
		});

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found",
			});
		}

		return user;
	}),

	getLeaderboard: protectedProcedure
		.input(z.enum(["luck", "money", "level"]))
		.query(async ({ ctx, input }) => {
			const baseQuery = {
				select: {
					id: true,
					name: true,
					image: true,
					experience: true,
					luck: true,
					money: true,
					vip: true,
				},
				where: {
					luck: { gt: 1 },
				},
				take: 10,
			} as const;

			const orderByConfig = {
				luck: [{ luck: "desc" as const }, { experience: "desc" as const }],
				money: [{ money: "desc" as const }, { experience: "desc" as const }],
				level: [{ experience: "desc" as const }, { luck: "desc" as const }],
			};

			const users = await ctx.db.user.findMany({
				...baseQuery,
				orderBy: orderByConfig[input],
			});

			return users;
		}),

	upgradeLuck: protectedProcedure
		.input(z.number().int().positive())
		.mutation(async ({ ctx, input: luckIncrement }) => {
			const userId = ctx.session.user.id;
			const now = Date.now();
			const cooldownMs = 2000;
			const cachedUser = userCache.get(userId);
			const lastLuckUpgrade = cachedUser?.lastLuckUpgrade?.getTime() ?? 0;

			if (lastLuckUpgrade && now - lastLuckUpgrade < cooldownMs) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: `Please wait ${((cooldownMs - (now - lastLuckUpgrade)) / 1000).toFixed(1)}s`,
				});
			}

			const user = await ctx.db.user.findUnique({
				where: { id: userId },
				select: { luck: true, money: true },
			});

			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found",
				});
			}

			let totalCost = 0;
			const baseCost = 95;
			const multiplier = 1.18;
			const baseLuck = Number(user.luck);

			for (let i = 0; i < luckIncrement; i++) {
				totalCost += Math.round(baseCost * Math.pow(multiplier, baseLuck + i));
			}

			const currentMoney = Number(user.money);
			if (currentMoney < totalCost) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Insufficient funds. Required: $${totalCost}, Available: $${currentMoney}`,
				});
			}

			const updatedUser = await ctx.db.user.update({
				where: { id: userId },
				data: {
					money: String(Math.round(currentMoney - totalCost)),
					luck: { increment: luckIncrement },
				},
			});

			return {
				user: updatedUser,
				cost: totalCost,
			};
		}),
});
