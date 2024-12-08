import type { Prisma, Sword } from "@prisma/client";

export interface UserStats {
	swords_generated: number | null;
	enchant_rerolls: number | null;
	swords_sacrified: number | null;
	successful_ascends: number | null;
	failed_ascends: number | null;
	highest_item_found: { chance: number; item_name: string } | null;
	last_sacrifice: Date | null;
}

export type UserProfile = {
	id: string;
	name: string | null;
	image: string | null;
	experience: Prisma.Decimal;
	luck: number;
	money: Prisma.Decimal;
	vip: boolean;
	currentSword: string | null;
	essence: number;
	stats: UserStats;
	joinedAt: Date;
	swords: Array<Sword>;
};
