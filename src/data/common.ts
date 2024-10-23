import Enchants from "@/data/enchants";
import Materials from "./materials";
import Qualities from "./qualities";
import Rarities from "./rarities";
import Auras from "./auras";
import Effects from "./effects";
import type { Sword } from "@prisma/client";

export type Property = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier?: number;
  color?: string | string[];
};

export interface UserType {
  luck: bigint;
  vip: boolean;
  swordId: string | null;
  experience: string;
  swords: {
    id: string;
    luck: number;
  }[];
}

export interface ClientUserType {
  name: string | null;
  vip: boolean;
  id: string;
  luck: bigint;
  essence: number;
  experience: string;
  swordId: string | null;
  money: string;
  swords: Sword[];
}

export function luckFromLevel(level: number): number {
  const baseLuckFactor = 1.02; // Start with a smaller base to slow growth
  const progressiveFactor = 0.002 * level; // Gradually increases per level

  return Math.pow(baseLuckFactor + progressiveFactor, level);
}

export function weekendLuck(): number {
  const date = new Date();
  const day = date.getDay();

  // 25% luck bonus on friday, saturday and sunday
  if (day === 5 || day === 6 || day === 0) return 1.25;

  return 1;
}

export function probability(chance: number, totalLuck: number): boolean {
  const pool = Math.random() * 100;
  return pool < 100 / (chance / totalLuck);
}

export function nonLuckProbability(chance: number) {
  return Math.random() * 100 < 100 / chance;
}

export function getForgingTitle(level: number): string {
  if (level > 90) return "Forging Grandmaster";
  if (level > 75) return "Forging Master";
  if (level > 60) return "Forging Expert";
  if (level > 50) return "Forging Journeyman";
  if (level > 40) return "Forging Apprentice";
  if (level > 30) return "Forging Trainee";
  if (level > 20) return "Forging Initiate";
  if (level > 10) return "Forging Adept";
  return "Forging Novice";
}
export function getEnchantData(swordEnchant: string) {
  const enchant = Enchants.find((e) => e.name === swordEnchant)!;

  let rarity: { name: string; color: string } = {
    name: "Uncommon",
    color: "rgb(0,200,100)",
  };

  let type: "money" | "luck" | "damage" | "experience" | "all" = "money";

  if (enchant.tier === 2)
    rarity = { name: "Uncommon", color: "rgb(85, 85, 255)" };
  if (enchant.tier === 3) rarity = { name: "Rare", color: "rgb(255, 85, 255)" };
  if (enchant.tier === 4) rarity = { name: "Epic", color: "rgb(255, 170, 0)" };
  if (enchant.tier === 5)
    rarity = {
      name: "Mythical",
      color: "rgb(128,0,0)",
    };
  if (enchant.tier === 6)
    rarity = {
      name: "Exotic",
      color: "rgb(255,0,255)",
    };

  if (enchant.valueMultiplier > 1 && enchant.experienceMultiplier > 1)
    type = "all";
  else if (enchant.valueMultiplier > 1) type = "money";
  else if (enchant.experienceMultiplier > 1) type = "experience";
  else if (enchant.damageMultiplier) type = "damage";
  else if (enchant.luckMultiplier) type = "luck";

  return { rarity, type, ...enchant };
}

export function getSwordAura(aura: string): string {
  const baseURL =
    "https://res.cloudinary.com/dbgwwgxli/image/upload/v1729594768/";

  if (!aura) return baseURL + `bastard_mcgatj`;

  switch (aura.toLowerCase()) {
    case "fire":
      return baseURL + `fire_yz4br1`;
    case "electric":
      return baseURL + `electric_k881be`;
    case "glitch":
      return baseURL + `glitch_ruowxk`;
    case "snow":
      return baseURL + `snow_xagxhc`;
    case "wind":
      return baseURL + `snow_xagxhc`;
    case "light":
      return baseURL + `light_qeca2n`;
    case "vortex":
      return baseURL + `vortex_quhbi5`;
    case "aegis":
      return baseURL + `aegis_wlvtiz`;
    case "godsent":
      return baseURL + `godsent_lwho5o`;
    default:
      return baseURL + `bastard_mcgatj`;
  }
}

export function getSacrificeRerolls(sword: {
  material: string;
  quality: string;
  rarity: string;
  aura?: string;
  effect?: string;
}): number {
  const sortedMaterials = [...Materials].sort((a, b) => a.chance - b.chance);
  const sortedQualities = [...Qualities].sort((a, b) => a.chance - b.chance);
  const sortedRarities = [...Rarities].sort((a, b) => a.chance - b.chance);
  const sortedAuras = [...Auras].sort((a, b) => b.chance - a.chance);
  const sortedEffects = [...Effects].sort((a, b) => b.chance - a.chance);

  const material = sortedMaterials.find((m) => m.name === sword.material);
  const quality = sortedQualities.find((q) => q.name === sword.quality);
  const rarity = sortedRarities.find((r) => r.name === sword.rarity);
  const aura = sortedAuras.find((a) => a.name === sword.aura);
  const effect = sortedEffects.find((e) => e.name === sword.effect);

  if (!material || !quality || !rarity) return 0;

  const essence =
    1 +
    Math.floor(
      (sortedMaterials.indexOf(material) * 0.5 +
        sortedQualities.indexOf(quality) * 0.5 +
        sortedRarities.indexOf(rarity) * 0.5) *
        (aura ? sortedAuras.indexOf(aura) + 1 : 1) *
        (effect ? sortedEffects.indexOf(effect) + 1 : 1),
    );

  return essence;
}
