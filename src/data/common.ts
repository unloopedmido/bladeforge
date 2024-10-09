import { type User } from "@prisma/client";
import Materials from "./materials";
import Qualities from "./qualities";
import Rarities from "./rarities";
import Auras from "./auras";
import { getLevelFromExperience } from "@/lib/func";

export type Property = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier?: number;
};

export function probability(
  chance: number,
  userLuck: number,
  levelLuck: number,
) {
  return Math.random() * 100 < 100 / (chance / userLuck / levelLuck);
}

export function luckFromLevel(level: number): number {
  return Math.pow(1.03, level); // Each level increases luck by a factor of 1.2
}

export function getRandomProperty(
  array: Property[],
  userLuck: number,
  levelLuck: number,
): Property {
  const sortedArray = array.sort((a, b) => b.chance - a.chance);
  let currentItem: Property = sortedArray[sortedArray.length - 1]!;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < sortedArray.length; i++) {
    if (probability(Number(sortedArray[i]?.chance), userLuck, levelLuck)) {
      currentItem = sortedArray[i]!;
      break;
    }
  }

  return currentItem;
}

export function getForgingTitle(level: number): string {
  if (level > 500) return "Forging Grandmaster";
  if (level > 250) return "Forging Master";
  if (level > 100) return "Forging Expert";
  if (level > 75) return "Forging Journeyman";
  if (level > 50) return "Forging Apprentice";
  if (level > 25) return "Forging Trainee";
  if (level > 10) return "Forging Initiate";
  if (level > 5) return "Forging Adept";
  return "Forging Novice";
}

export function generateSword(user: User) {
  const levelLuck = luckFromLevel(
    getLevelFromExperience(Number(user.experience)),
  );
  const userLuck = Number(user.luck) * (user.vip ? 1.25 : 1); // VIP users get a 25% luck bonus
  const material = getRandomProperty(Materials, userLuck, levelLuck);
  const rarity = getRandomProperty(Rarities, userLuck, levelLuck);
  const quality = getRandomProperty(Qualities, userLuck, levelLuck);
  const aura = getRandomProperty(Auras, user.vip ? 1.25 : 1, 1);
  const shiny = Math.random() < 0.25; // 25% chance of being shiny

  const value = Math.floor(
    (material?.valueMultiplier ?? 1) *
      (rarity?.valueMultiplier ?? 1) *
      (quality?.valueMultiplier ?? 1) *
      (aura?.valueMultiplier ?? 1) *
      (shiny ? 1.5 : 1),
  );

  const damage = Math.floor(
    (rarity?.damageMultiplier ?? 1) *
      (quality?.damageMultiplier ?? 1) *
      (aura?.damageMultiplier ?? 1) *
      (shiny ? 1.5 : 1),
  );

  const experience = Math.floor(value * 0.1); // 10% of value

  return {
    material: material?.name,
    rarity: rarity?.name,
    quality: quality?.name,
    aura: aura?.name,
    shiny,
    value,
    damage,
    experience,
  };
}
