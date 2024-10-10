import { type User } from "@prisma/client";
import { getLevelFromExperience } from "@/lib/func";
import { db } from "@/server/db";
import {
  luckFromLevel,
  probability,
  type Property,
  weekendLuck,
} from "@/data/common";
import Materials from "@/data/materials";
import Rarities from "@/data/rarities";
import Qualities from "@/data/qualities";
import Auras from "@/data/auras";

export async function globalConfig() {
  const config = await db.config.findFirst();

  if (!config) {
    throw new Error("No global config found");
  }

  return {
    valueMultiplier: config?.valueMultiplier ?? 1,
    experienceMultiplier: config?.experienceMultiplier ?? 1,
    luckMultiplier: config?.luckMultiplier ?? 1,
  };
}

export async function totalLuck(user: User): Promise<number> {
  const level = getLevelFromExperience(Number(user.experience));
  const vip = user.vip ? 1.25 : 1;
  const userLuck = luckFromLevel(level);
  const weekend = weekendLuck();
  const config = await globalConfig();

  return Math.floor(userLuck * vip * level * weekend * config.luckMultiplier);
}

export async function getRandomProperty(
  array: Property[],
  user: User,
  nonLuck?: boolean,
): Promise<Property> {
  const sortedArray = array.sort((a, b) => b.chance - a.chance);
  let currentItem: Property = sortedArray[sortedArray.length - 1]!;

  const userTotalLuck = nonLuck ? 1 : await totalLuck(user);

  console.log(userTotalLuck)

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < sortedArray.length; i++) {
    if (probability(Number(sortedArray[i]?.chance), userTotalLuck)) {
      currentItem = sortedArray[i]!;
      break;
    }
  }

  return currentItem;
}

export async function generateSword(user: User) {
  const config = await globalConfig();

  const material = await getRandomProperty(Materials, user);
  const rarity = await getRandomProperty(Rarities, user);
  const quality = await getRandomProperty(Qualities, user);
  const aura = await getRandomProperty(Auras, user, true);
  const shiny = Math.random() < 0.25; // 25% chance of being shiny

  const value = Math.floor(
    (material?.valueMultiplier ?? 1) *
      (rarity?.valueMultiplier ?? 1) *
      (quality?.valueMultiplier ?? 1) *
      (aura?.valueMultiplier ?? 1) *
      (shiny ? 1.5 : 1) *
      config.valueMultiplier,
  );

  const damage = Math.floor(
    (rarity?.damageMultiplier ?? 1) *
      (quality?.damageMultiplier ?? 1) *
      (aura?.damageMultiplier ?? 1) *
      (shiny ? 1.5 : 1),
  );

  const experience = Math.floor(value * 0.1) * config.experienceMultiplier; // 10% of value

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
