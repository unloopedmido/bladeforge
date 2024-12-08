import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateSword } from "@/server/util";
import { calculateSacrificeRerolls } from "@/data/common";
import type { User } from "@prisma/client";
import { type Enchant } from "@/data/enchants";
import { type UserStats } from "@/server/user";

interface CachedUser {
	lastGenerate?: Date;
	lastSell?: Date;
	lastStore?: Date;
	lastEquip?: Date;
}

class SwordCache {
	private cache = new Map<string, CachedUser>();
	private static CACHE_DURATION = 1000 * 60 * 60; // 1 hour

	constructor() {
		this.startCleanupInterval();
	}

	private startCleanupInterval() {
		setInterval(() => {
			const now = Date.now();
			for (const [userId, user] of this.cache.entries()) {
				const isExpired = (date?: Date) =>
					date && now - date.getTime() >= SwordCache.CACHE_DURATION;

				if (
					isExpired(user.lastGenerate) ||
					isExpired(user.lastSell) ||
					isExpired(user.lastStore) ||
					isExpired(user.lastEquip)
				) {
					this.cache.delete(userId);
				}
			}
		}, SwordCache.CACHE_DURATION);
	}

	get(userId: string): CachedUser | undefined {
		return this.cache.get(userId);
	}

	set(userId: string, data: CachedUser): void {
		this.cache.set(userId, {
			...this.get(userId),
			...data,
		});
	}
}

const swordCache = new SwordCache();

// Helper function to check cooldown
const checkCooldown = (
	user: User,
	cachedUser: CachedUser | undefined,
	action: keyof CachedUser,
) => {
	const now = Date.now();
	const lastAction = cachedUser?.[action]?.getTime() ?? 0;
	const cooldown = user.vip ? 1000 : 2000;

	if (now - lastAction < cooldown) {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: `Please wait ${((cooldown - (now - lastAction)) / 1000).toFixed(
				1,
			)}s before ${action.replace("last", "").toLowerCase()}ing again`,
		});
	}
};

// Helper function to clean up sword properties
const cleanupSwordProperties = (sword: {
	material: string;
	rarity: string;
	quality: string;
	aura: string;
	effect: string;
	value: number;
	damage: number;
	luck: number;
	experience: number;
	enchants: Enchant[];
	essence: number;
}) => {
	const cleanedSword = { ...sword };

	if (cleanedSword.aura === "None") {
		cleanedSword.aura = undefined!;
	}

	if (cleanedSword.effect === "None") {
		cleanedSword.effect = undefined!;
	}

	if (cleanedSword.essence === 0) {
		cleanedSword.essence = calculateSacrificeRerolls({
			material: cleanedSword.material,
			quality: cleanedSword.quality,
			rarity: cleanedSword.rarity,
			aura: cleanedSword.aura,
			effect: cleanedSword.effect,
		});
	}

	return cleanedSword;
};

// Helper function to update user stats
const updateUserStats = (currentStats: UserStats | null): UserStats => {
	const stats = currentStats ?? {
		swords_generated: 0,
		enchant_rerolls: null,
		swords_sacrified: null,
		successful_ascends: null,
		failed_ascends: null,
		highest_item_found: null,
		last_sacrifice: null,
	};

	return {
		...stats,
		swords_generated: (stats.swords_generated ?? 0) + 1,
	};
};

export const swordRouter = createTRPCRouter({
	generate: protectedProcedure.mutation(async ({ ctx }) => {
		// Fetch user
		const user = await ctx.db.user.findFirstOrThrow({
			where: { id: ctx.session.user.id },
			include: { swords: true },
		});

		// Check if user has a sword equipped
		if (user.currentSword) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message:
					"You must unequip your current sword before generating a new one",
			});
		}

		// Check cooldown
		const cachedUser = swordCache.get(user.id);
		checkCooldown(user, cachedUser, "lastGenerate");

		try {
			// Generate new sword
			const generatedSword = await generateSword(user);
			const cleanedSword = cleanupSwordProperties(generatedSword);

			// Create sword and update user in parallel
			const [sword] = await Promise.all([
				ctx.db.sword.create({
					data: {
						...cleanedSword,
						ownerId: user.id,
						value: String(cleanedSword.value),
						damage: String(cleanedSword.damage),
						experience: String(cleanedSword.experience),
						enchants:
							cleanedSword.enchants?.map((enchant) => enchant.name) ?? [],
					},
				}),
				ctx.db.user.update({
					where: { id: user.id },
					data: {
						currentSword: undefined,
						stats: JSON.stringify(
							updateUserStats(user.stats as UserStats | null),
						),
					},
				}),
			]);

			// Update cache
			swordCache.set(user.id, {
				lastGenerate: new Date(),
			});

			return sword;
		} catch (error) {
			console.error("Failed to generate sword:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to generate sword",
			});
		}
	}),
});
