import { getLevelFromExperience } from "@/lib/func";
import { db } from "@/server/db";
import {
  calculateLuckFromLevel,
  calculateProbability,
  calculateSacrificeRerolls,
  getWeekendLuckMultiplier,
  type Property,
  type UserType,
} from "@/data/common";
import Materials from "@/data/materials";
import Rarities from "@/data/rarities";
import Qualities from "@/data/qualities";
import Auras from "@/data/auras";
import Enchants, { type Enchant } from "@/data/enchants";
import Effects from "@/data/effects";

interface Config {
  valueMultiplier: number;
  experienceMultiplier: number;
  luckMultiplier: number;
}

let configCache: Config | null = null;
const CONFIG_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let lastConfigFetch = 0;

export async function globalConfig() {
  const now = Date.now();
  if (configCache && now - lastConfigFetch < CONFIG_CACHE_TTL) {
    return configCache;
  }

  const config = await db.config.findFirst();
  if (!config) throw new Error("No global config found");

  configCache = {
    valueMultiplier: config.valueMultiplier ?? 1,
    experienceMultiplier: config.experienceMultiplier ?? 1,
    luckMultiplier: config.luckMultiplier ?? 1,
  };
  lastConfigFetch = now;

  return configCache;
}

export async function totalLuck(user: {
  vip: boolean;
  experience: string;
  luck: bigint;
  swordId: string | null;
  swords: { id: string; luck: number }[];
}): Promise<number> {
  const level = getLevelFromExperience(Number(user.experience));
  const vip = user.vip ? 1.3 : 1;
  const levelLuck = calculateLuckFromLevel(level);
  const userLuck = Number(user.luck);
  const weekend = getWeekendLuckMultiplier();
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
    if (
      calculateProbability(Number(property.chance), nonLuck ? 1 : userTotalLuck)
    ) {
      return property;
    }
  }

  return sortedArray[sortedArray.length - 1]!;
}

export async function generateSword(user: UserType) {
  const config = await globalConfig();

  const [rarity, quality, material, aura, effect] = await Promise.all([
    getProperty(Rarities, user),
    getProperty(Qualities, user),
    getProperty(Materials, user),
    getRandomAura(),
    getRandomEffect(),
  ]);

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

  let experience = Math.floor(value * 0.2); // 20% of value
  const levelBonus = 1 + userLevel * 0.01; // 1% per level
  const titleBonus = getTitleExpBonus(userLevel);

  experience = Math.floor(
    experience *
      enchantExperience *
      config.experienceMultiplier *
      levelBonus *
      titleBonus,
  );

  const essence = calculateSacrificeRerolls({
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

/**
 * Get experience bonus based on forging title milestones
 */
function getTitleExpBonus(level: number): number {
  if (level >= 90) return 1.5; // Grandmaster: 50% bonus
  if (level >= 75) return 1.4; // Master: 40% bonus
  if (level >= 60) return 1.3; // Expert: 30% bonus
  if (level >= 50) return 1.25; // Journeyman: 25% bonus
  if (level >= 40) return 1.2; // Apprentice: 20% bonus
  if (level >= 30) return 1.15; // Trainee: 15% bonus
  if (level >= 20) return 1.1; // Initiate: 10% bonus
  if (level >= 10) return 1.05; // Adept: 5% bonus
  return 1; // Novice: No bonus
}

const CACHED_TOTALS = {
  enchants: Enchants.reduce((sum, enchant) => sum + enchant.chance, 0),
  auras: Auras.reduce((sum, aura) => sum + aura.chance, 0),
  effects: Effects.reduce((sum, effect) => sum + effect.chance, 0),
};

export function getRandomEnchant(): Enchant {
  const randomValue = Math.random() * CACHED_TOTALS.enchants;
  let accumulatedChance = 0;

  for (const enchant of Enchants) {
    accumulatedChance += enchant.chance;
    if (randomValue < accumulatedChance) {
      return enchant;
    }
  }

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

// Batch webhook sends and add rate limiting
const webhookQueue = new Map<string, WebhookEmbed[]>();
const BATCH_INTERVAL = 2000; // 2 seconds
const MAX_BATCH_SIZE = 10;

export const sendDiscordWebhook = async (
  webhookUrl: string,
  embeds: WebhookEmbed[],
) => {
  const currentQueue = webhookQueue.get(webhookUrl) ?? [];
  currentQueue.push(...embeds);
  webhookQueue.set(webhookUrl, currentQueue);

  if (currentQueue.length >= MAX_BATCH_SIZE) {
    void processWebhookQueue(webhookUrl);
  }
};

async function processWebhookQueue(webhookUrl: string) {
  const embeds = webhookQueue.get(webhookUrl) ?? [];
  if (embeds.length === 0) return;

  webhookQueue.set(webhookUrl, []);

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds }),
    });
  } catch (error) {
    console.error("Failed to send Discord webhook:", error);
  }
}

setInterval(() => {
  for (const url of webhookQueue.keys()) {
    void processWebhookQueue(url);
  }
}, BATCH_INTERVAL);
