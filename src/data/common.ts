import { type User } from "@prisma/client";
import Materials from "./materials";
import Qualities from "./qualities";
import Rarities from "./rarities";
import Auras from "./auras";

export type Property = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier?: number;
};


export function probability(chance: number, userLuck: number) {
  return Math.random() * 100 < 100 / (chance / userLuck);
}

export function getRandomProperty(
  array: Property[],
  userLuck: number,
): Property {
  const sortedArray = array.sort((a, b) => b.chance - a.chance);
  let currentItem: Property = sortedArray[sortedArray.length - 1]!;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < sortedArray.length; i++) {
    if (probability(Number(sortedArray[i]?.chance), userLuck)) {
      currentItem = sortedArray[i]!;
      break;
    }
  }

  return currentItem;
}

export function generateSword(user: User) {
  const userLuck = Number(user.luck) * (user.vip ? 1.25 : 0); // VIP users get a 25% luck bonus
  const material = getRandomProperty(Materials, userLuck);
  const rarity = getRandomProperty(Rarities, userLuck);
  const quality = getRandomProperty(Qualities, userLuck);
  const aura = getRandomProperty(Auras, user.vip ? 1.25 : 1);
  const shiny = Math.random() < 0.5; // 50% chance of being shiny

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

  return {
    material: material?.name,
    rarity: rarity?.name,
    quality: quality?.name,
    aura: aura?.name,
    shiny,
    value,
    damage,
  };
}
