import Enchants from "@/data/enchants";
import Materials from "./materials";
import Qualities from "./qualities";
import Rarities from "./rarities";
import Auras from "./auras";
import Effects from "./effects";
import { z } from "zod";

// Constants
const WEEKEND_LUCK_MULTIPLIER = 1.25;
const BASE_LUCK_FACTOR = 1.02;
const PROGRESSIVE_FACTOR_MULTIPLIER = 0.002;

export const PropertySchema = z.object({
	name: z.string(),
	chance: z.number().min(0).max(100),
	valueMultiplier: z.number().positive(),
	damageMultiplier: z.number().optional(),
	color: z.union([z.string(), z.array(z.string())]).optional(),
});

export type Property = z.infer<typeof PropertySchema>;

// Enums for better type safety
export enum PropertyType {
	Money = "money",
	Luck = "luck",
	Damage = "damage",
	Experience = "experience",
	All = "all",
}

/**
 * Calculates luck based on level with progressive scaling
 * @param level - The current level
 * @returns The calculated luck value
 */
export function calculateLuckFromLevel(level: number): number {
	if (level < 0) throw new Error("Level cannot be negative");

	const progressiveFactor = PROGRESSIVE_FACTOR_MULTIPLIER * level;
	return Math.pow(BASE_LUCK_FACTOR + progressiveFactor, level);
}

/**
 * Determines if current time qualifies for weekend luck bonus
 * @returns Luck multiplier (1.25 for weekend, 1 for weekday)
 */
export function getWeekendLuckMultiplier(): number {
	const day = new Date().getDay();
	return [0, 5, 6].includes(day) ? WEEKEND_LUCK_MULTIPLIER : 1;
}

/**
 * Calculates probability with luck factor
 * @param chance - Base chance percentage (0-100)
 * @param totalLuck - Total luck modifier
 * @returns Whether the probability check passed
 */
export function calculateProbability(
	chance: number,
	totalLuck: number,
): boolean {
	if (totalLuck <= 0) throw new Error("Total luck must be positive");

	return Math.random() * 100 < (100 * totalLuck) / chance;
}

/**
 * Calculates probability without luck factor
 * @param chance - Base chance percentage (0-100)
 * @returns Whether the probability check passed
 */
export function calculateBaseProbability(chance: number): boolean {
	return Math.random() * 100 < 100 / chance;
}

interface ForgingTitle {
	readonly title: string;
	readonly minLevel: number;
}

const FORGING_TITLES: readonly ForgingTitle[] = [
	{ title: "Forging Grandmaster", minLevel: 90 },
	{ title: "Forging Master", minLevel: 75 },
	{ title: "Forging Expert", minLevel: 60 },
	{ title: "Forging Journeyman", minLevel: 50 },
	{ title: "Forging Apprentice", minLevel: 40 },
	{ title: "Forging Trainee", minLevel: 30 },
	{ title: "Forging Initiate", minLevel: 20 },
	{ title: "Forging Adept", minLevel: 10 },
	{ title: "Forging Novice", minLevel: 0 },
] as const;

/**
 * Gets the forging title based on level
 * @param level - Current forging level
 * @returns Appropriate forging title
 */
export function getForgingTitle(level: number): string {
	if (level < 0) throw new Error("Level cannot be negative");
	return (
		FORGING_TITLES.find(({ minLevel }) => level > minLevel)?.title ??
		FORGING_TITLES[FORGING_TITLES.length - 1]?.title ??
		"Unknown Title"
	);
}

interface EnchantData {
	rarity: {
		name: string;
		color: string;
	};
	type: PropertyType;
	tier: number;
	valueMultiplier: number;
	experienceMultiplier: number;
	damageMultiplier: number;
	luckMultiplier: number;
	name: string;
	color: string | string[];
}

/**
 * Gets enchant data for a sword
 * @param swordEnchant - Name of the enchant
 * @returns Enchant data including rarity and type
 * @throws Error if enchant not found
 */
export function getEnchantData(swordEnchant: string): EnchantData {
	const enchant = Enchants.find((e) => e.name === swordEnchant);
	if (!enchant) throw new Error(`Enchant "${swordEnchant}" not found`);

	const rarityMap = new Map([
		[2, { name: "Uncommon", color: "rgb(85, 85, 255)" }],
		[3, { name: "Rare", color: "rgb(255, 85, 255)" }],
		[4, { name: "Epic", color: "rgb(255, 170, 0)" }],
		[5, { name: "Mythical", color: "rgb(128,0,0)" }],
		[6, { name: "Exotic", color: "rgb(97,28,53)" }],
	]);

	const rarity = rarityMap.get(enchant.tier) ?? {
		name: "Uncommon",
		color: "rgb(0,200,100)",
	};

	let type = PropertyType.Money;
	if (enchant.valueMultiplier > 1 && enchant.experienceMultiplier > 1) {
		type = PropertyType.All;
	} else if (enchant.experienceMultiplier > 1) {
		type = PropertyType.Experience;
	} else if (enchant.damageMultiplier) {
		type = PropertyType.Damage;
	} else if (enchant.luckMultiplier) {
		type = PropertyType.Luck;
	}

	return { rarity, type, ...enchant };
}

const SWORD_AURA_BASE_URL =
	"https://res.cloudinary.com/dbgwwgxli/image/upload/v1729594768/";

const AURA_IMAGE_MAP = new Map([
	["fire", "fire_yz4br1"],
	["electric", "electric_k881be"],
	["glitch", "glitch_ruowxk"],
	["snow", "snow_xagxhc"],
	["wind", "snow_xagxhc"],
	["light", "light_qeca2n"],
	["vortex", "vortex_quhbi5"],
	["aegis", "aegis_wlvtiz"],
	["godsent", "godsent_lwho5o"],
]);

/**
 * Gets the sword aura image URL
 * @param aura - Name of the aura
 * @returns Full URL for the aura image
 */
export function getSwordAura(aura?: string): string {
	if (!aura) return `${SWORD_AURA_BASE_URL}bastard_mcgatj`;

	const auraKey = aura.toLowerCase();
	const imageId = AURA_IMAGE_MAP.get(auraKey) ?? "bastard_mcgatj";
	return `${SWORD_AURA_BASE_URL}${imageId}`;
}

interface SwordProperties {
	material: string;
	quality: string;
	rarity: string;
	aura?: string;
	effect?: string;
}

/**
 * Calculates sacrifice rerolls for a sword
 * @param sword - Sword properties
 * @returns Number of rerolls
 */
export function calculateSacrificeRerolls(sword: SwordProperties): number {
	const sortedArrays = {
		materials: [...Materials].sort((a, b) => a.chance - b.chance),
		qualities: [...Qualities].sort((a, b) => a.chance - b.chance),
		rarities: [...Rarities].sort((a, b) => a.chance - b.chance),
		auras: [...Auras].sort((a, b) => b.chance - a.chance),
		effects: [...Effects].sort((a, b) => b.chance - a.chance),
	};

	const properties = {
		material: sortedArrays.materials.find((m) => m.name === sword.material),
		quality: sortedArrays.qualities.find((q) => q.name === sword.quality),
		rarity: sortedArrays.rarities.find((r) => r.name === sword.rarity),
		aura: sword.aura
			? sortedArrays.auras.find((a) => a.name === sword.aura)
			: undefined,
		effect: sword.effect
			? sortedArrays.effects.find((e) => e.name === sword.effect)
			: undefined,
	};

	if (!properties.material || !properties.quality || !properties.rarity) {
		return 0;
	}

	const baseValue =
		sortedArrays.materials.indexOf(properties.material) * 0.5 +
		sortedArrays.qualities.indexOf(properties.quality) * 0.5 +
		sortedArrays.rarities.indexOf(properties.rarity) * 0.5;

	const auraMultiplier = properties.aura
		? sortedArrays.auras.indexOf(properties.aura) + 1
		: 1;

	const effectMultiplier = properties.effect
		? sortedArrays.effects.indexOf(properties.effect) + 1
		: 1;

	return 1 + Math.floor(baseValue * auraMultiplier * effectMultiplier);
}
