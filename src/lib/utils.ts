import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const SYMBOL: string[] = [
	"",
	"k",
	"M",
	"B",
	"T",
	"Q",
	"Qn",
	"Sx",
	"Sp",
	"O",
	"N",
	"D",
];

export function abbreviateNumber(
	value: number | bigint | { toString: () => string },
): string {
	// Convert to number
	const numValue = Number(value.toString());

	// Handle zero case
	if (numValue === 0) return "0";

	// Get the tier (K, M, B, etc.)
	const tier = Math.floor(Math.log10(Math.abs(numValue)) / 3);

	// If the number is smaller than 1000, return it as is
	if (tier === 0) return numValue.toString();

	// Get the suffix for this tier
	const suffix = SYMBOL[tier] ?? "";

	// Scale the number down
	const scale = Math.pow(10, tier * 3);
	const scaled = numValue / scale;

	// Format to 2 decimal places and remove trailing zeros
	return `${scaled.toFixed(2).replace(/\.?0+$/, "")}${suffix}`;
}

export function rgbToAlpha(rgb: string | string[], alpha: number): string[] {
	if (typeof rgb === "string") {
		return [
			rgb.replace("rgb", "rgba").replace(")", `,${alpha})`),
			rgb.replace("rgb", "rgba").replace(")", `,${alpha})`),
		];
	} else {
		return rgb.map((color) =>
			color.replace("rgb", "rgba").replace(")", `,${alpha})`),
		);
	}
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
