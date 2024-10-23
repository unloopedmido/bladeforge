import { getLevelFromExperience } from "@/lib/func";
import { db } from "@/server/db";
import {
  getSacrificeRerolls,
  luckFromLevel,
  probability,
  type Property,
  type UserType,
  weekendLuck,
} from "@/data/common";
import Materials from "@/data/materials";
import Rarities from "@/data/rarities";
import Qualities from "@/data/qualities";
import Auras from "@/data/auras";
import Enchants, { type Enchant } from "@/data/enchants";
import Effects from "@/data/effects";


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

export async function totalLuck(user: UserType): Promise<number> {
  const level = getLevelFromExperience(Number(user.experience));
  const vip = user.vip ? 1.3 : 1;
  const levelLuck = luckFromLevel(level);
  const userLuck = Number(user.luck);
  const weekend = weekendLuck();
  const config = await globalConfig();

  if (user.swordId) {
    const sword = user.swords.find((s) => s.id === user.swordId);

    if (!sword) {
      throw new Error("Sword not found");
    }

    return Math.floor(
      userLuck *
        vip *
        level *
        weekend *
        config.luckMultiplier *
        sword.luck *
        levelLuck,
    );
  }

  return Math.floor(
    userLuck * vip * level * weekend * config.luckMultiplier * levelLuck,
  );
}

export async function getProperty(
  array: Property[],
  user: UserType,
  nonLuck?: boolean,
): Promise<Property> {
  const sortedArray = array.sort((a, b) => b.chance - a.chance);

  const userTotalLuck = await totalLuck({
    luck: user.luck,
    experience: user.experience,
    vip: user.vip,
    swordId: user.swordId,
    swords: user.swords,
  });

  for (const property of sortedArray) {
    if (probability(Number(property.chance), nonLuck ? 1 : userTotalLuck)) {
      return property;
    }
  }

  return sortedArray[sortedArray.length - 1]!;
}

export async function generateSword(user: UserType) {
  const config = await globalConfig();

  const material = await getProperty(Materials, user);
  const rarity = await getProperty(Rarities, user);
  const quality = await getProperty(Qualities, user);
  const aura = getRandomAura();
  const effect = getRandomEffect();

  const userLevel = getLevelFromExperience(Number(user.experience));

  function getEnchants() {
    const enchants = new Set<Enchant>();

    const addUniqueEnchants = (count: number) => {
      while (enchants.size < count) {
        enchants.add(getRandomEnchant());
      }
    };

    if (userLevel < 10) {
      return [];
    } else if (userLevel >= 75) {
      addUniqueEnchants(4);
    } else if (userLevel >= 50) {
      addUniqueEnchants(3);
    } else if (userLevel >= 25) {
      addUniqueEnchants(2);
    } else if (userLevel >= 10) {
      addUniqueEnchants(1);
    }

    return Array.from(enchants);
  }

  const enchants = getEnchants();

  let enchantLuck = 0;
  let enchantDamage = 0;
  let enchantExperience = 0;
  let enchantValue = 0;

  enchants.forEach((enchant) => {
    enchantLuck += enchant.luckMultiplier;
    enchantDamage += enchant.damageMultiplier;
    enchantExperience += enchant.experienceMultiplier;
    enchantValue += enchant.valueMultiplier;
  });

  const value = Math.floor(
    (material?.valueMultiplier ?? 1) *
      (rarity?.valueMultiplier ?? 1) *
      (quality?.valueMultiplier ?? 1) *
      (aura?.valueMultiplier ?? 1) *
      effect.valueMultiplier *
      config.valueMultiplier *
      (enchantValue || 1),
  );

  const damage = Math.floor(
    (rarity?.damageMultiplier ?? 1) *
      (quality?.damageMultiplier ?? 1) *
      (aura?.damageMultiplier ?? 1) *
      (effect.damageMultiplier ?? 1) *
      (enchantDamage || 1),
  );

  const experience = Math.floor(
    (value / 14) *
      (enchantExperience || 1) *
      (config.experienceMultiplier || 1),
  ); // 14% of value

  const essence = getSacrificeRerolls({
    material: material.name,
    rarity: rarity.name,
    quality: quality.name,
    aura: aura.name,
    effect: effect.name,
  });

  return {
    material: material?.name,
    rarity: rarity?.name,
    quality: quality?.name,
    aura: aura?.name,
    effect: effect.name,
    value,
    damage,
    luck: enchantLuck || 1,
    experience,
    enchants,
    essence,
  };
}

export function getRandomEnchant(): Enchant {
  const totalChance = Enchants.reduce(
    (sum, enchant) => sum + enchant.chance,
    0,
  );
  const randomValue = Math.random() * totalChance;
  let accumulatedChance = 0;

  for (const enchant of Enchants) {
    accumulatedChance += enchant.chance;
    if (randomValue < accumulatedChance) {
      return enchant;
    }
  }

  // This line should never be reached if the chances sum up to 100%,
  // but it's here as a fallback
  return Enchants[Enchants.length - 1]!;
}

export function getRandomAura(): Property {
  const totalChance = Auras.reduce((sum, aura) => sum + aura.chance, 0);
  const randomValue = Math.random() * totalChance;
  let accumulatedChance = 0;

  for (const aura of Auras) {
    accumulatedChance += aura.chance;
    if (randomValue < accumulatedChance) {
      return aura;
    }
  }

  // This line should never be reached if the chances sum up to 100%,
  // but it's here as a fallback
  return Auras[Auras.length - 1]!;
}

export function getRandomEffect(): Property {
  const totalChance = Effects.reduce((sum, effect) => sum + effect.chance, 0);
  const randomValue = Math.random() * totalChance;
  let accumulatedChance = 0;

  for (const effect of Effects) {
    accumulatedChance += effect.chance;
    if (randomValue < accumulatedChance) {
      return effect;
    }
  }

  // This line should never be reached if the chances sum up to 100%,
  // but it's here as a fallback
  return Effects[Effects.length - 1]!;
}

interface WebhookEmbed {
  title: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  timestamp?: string;
  footer?: { text: string; icon_url?: string };
  thumbnail?: { url: string };
}

export const sendDiscordWebhook = async (
  webhookUrl: string,
  embeds: WebhookEmbed[],
) => {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds }),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to send Discord webhook:", error);
  }
};
