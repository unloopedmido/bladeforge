import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import Materials from "@/data/materials";
import Qualities from "@/data/qualities";
import Rarities from "@/data/rarities";
import { getProperty, sendDiscordWebhook, totalLuck } from "@/server/util";
import { env } from "@/env";
import type { Sword, User } from "@prisma/client";
import { calculateSacrificeRerolls, type Property } from "@/data/common";
import { abbreviateNumber } from "@/lib/utils";

// Define types for better DX
type RefineableProperty = "material" | "quality" | "rarity";
type PropertyArray = typeof Materials | typeof Qualities | typeof Rarities;

interface CachedUser {
	lastRefine?: Date;
}

class RefineCache {
	private cache = new Map<string, CachedUser>();
	private static CACHE_DURATION = 1000 * 60 * 60; // 1 hour

	constructor() {
		this.startCleanupInterval();
	}

	private startCleanupInterval() {
		setInterval(() => {
			const now = Date.now();
			for (const [userId, user] of this.cache.entries()) {
				if (
					user.lastRefine &&
					now - user.lastRefine.getTime() >= RefineCache.CACHE_DURATION
				) {
					this.cache.delete(userId);
				}
			}
		}, RefineCache.CACHE_DURATION);
	}

	get(userId: string): CachedUser | undefined {
		return this.cache.get(userId);
	}

	set(userId: string, data: CachedUser): void {
		this.cache.set(userId, data);
	}
}

const refineCache = new RefineCache();

// Helper functions for better organization
const getPropertyArray = (propertyType: RefineableProperty): PropertyArray =>
	({
		material: Materials,
		quality: Qualities,
		rarity: Rarities,
	})[propertyType];

const calculateNewStats = (
	sword: Sword,
	currentProperty: Property | undefined,
	attemptedProperty: Property,
	propertyType: RefineableProperty,
) => {
	const newValue =
		(Number(sword.value) / (currentProperty?.valueMultiplier ?? 1)) *
		attemptedProperty.valueMultiplier;

	const newDamage =
		propertyType !== "material" && currentProperty?.damageMultiplier
			? (Number(sword.damage) / currentProperty.damageMultiplier) *
				(attemptedProperty.damageMultiplier ?? 1)
			: Number(sword.damage);

	return {
		value: Math.round(newValue),
		damage: Math.round(newDamage),
		experience: Math.floor(newValue * 0.14),
	};
};

const handleRareFind = async (
	user: User,
	attemptedProperty: Property,
	personalizedLuck: number,
) => {
	if (personalizedLuck <= 2000 || !env.DISCORD_WEBHOOK_URI) return;

	try {
		await sendDiscordWebhook(env.DISCORD_WEBHOOK_URI, [
			{
				title: `🎉 ${user.name} has found a ${attemptedProperty.name}!`,
				description: `Personalized Chance: 1/${abbreviateNumber(personalizedLuck)}
        \nBase Chance: 1/${abbreviateNumber(attemptedProperty.chance)}`,
				timestamp: new Date().toISOString(),
				footer: { text: "Rare Find!" },
			},
		]);
	} catch (error) {
		console.error("Failed to send webhook", error);
	}
};

export const refinerRouter = createTRPCRouter({
	refine: protectedProcedure
		.input(z.enum(["material", "quality", "rarity"]))
		.mutation(async ({ ctx, input: propertyType }) => {
			// Fetch user and sword in parallel for better performance
			const user = await ctx.db.user.findFirstOrThrow({
				where: { id: ctx.session.user.id },
				include: { swords: true },
			});

			if (!user.currentSword)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "No sword equipped",
				});

			const sword = await ctx.db.sword.findFirst({
				where: {
					id: user.currentSword,
					ownerId: ctx.session.user.id,
				},
			});

			if (!sword) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No sword equipped",
				});
			}

			// Check cooldown
			const now = Date.now();
			const cachedUser = refineCache.get(user.id);
			const lastRefine = cachedUser?.lastRefine?.getTime() ?? 0;
			const cooldown = user.vip ? 500 : 1000;

			if (now - lastRefine < cooldown) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: `Please wait ${((cooldown - (now - lastRefine)) / 1000).toFixed(1)}s before attempting to refine again`,
				});
			}

			// Get properties and calculate luck
			const propertyArray = getPropertyArray(propertyType);
			const currentProperty = propertyArray.find(
				(property) => property.name === sword[propertyType],
			);

			const [userTotalLuck, attemptedProperty] = await Promise.all([
				totalLuck(user),
				getProperty(propertyArray, user),
			]);

			const personalizedLuck = attemptedProperty.chance / userTotalLuck;

			// Validate refinement possibility
			if (attemptedProperty.chance <= (currentProperty?.chance ?? 0)) {
				refineCache.set(user.id, { lastRefine: new Date() });
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Failed to refine to ${attemptedProperty.name} (1/${abbreviateNumber(personalizedLuck)}) as the current ${propertyType} is better or same`,
				});
			}

			// Handle webhook for rare finds
			void handleRareFind(user, attemptedProperty, personalizedLuck);

			// Calculate new stats
			const newStats = calculateNewStats(
				sword,
				currentProperty,
				attemptedProperty,
				propertyType,
			);

			// Update sword
			const updatedSword = await ctx.db.sword.update({
				where: { id: sword.id },
				data: {
					[propertyType]: attemptedProperty.name,
					value: String(newStats.value),
					damage: String(newStats.damage),
					experience: String(newStats.experience),
					essence: calculateSacrificeRerolls({
						material: sword.material,
						quality: sword.quality,
						rarity: sword.rarity,
						aura: sword.aura ?? undefined,
						effect: sword.effect ?? undefined,
						[propertyType]: attemptedProperty.name,
					}),
				},
			});

			// Update cache
			refineCache.set(user.id, { lastRefine: new Date() });

			return {
				sword: updatedSword,
				property: attemptedProperty,
				luck: personalizedLuck,
			};
		}),
});
