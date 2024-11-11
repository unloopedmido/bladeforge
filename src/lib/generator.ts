// lib/sword-generator.ts

import { Prisma } from "@prisma/client";
import Materials from "@/data/materials";
import Qualities from "@/data/qualities";
import Rarities from "@/data/rarities";
import Auras from "@/data/auras";
import Effects from "@/data/effects";
import Enchants, { type Enchant } from "@/data/enchants";
import { calculateProbability } from "@/data/common";

interface PropertyWithChance {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier?: number;
  color?: string | string[];
}

function getRandomProperty(
  properties: PropertyWithChance[],
  totalLuck: number,
): PropertyWithChance {
  // Sort properties by chance (higher chance = more common)
  const sortedProperties = [...properties].sort((a, b) => a.chance - b.chance);
  
  // Try to get rarer properties first
  for (const property of sortedProperties) {
    if (calculateProbability(property.chance, totalLuck)) {
      return property;
    }
  }
  
  // Fallback to most common property
  return sortedProperties[sortedProperties.length - 1]!;
}

function getRandomEnchant(): Enchant {
  const enchantPool = [...Enchants];
  const randomIndex = Math.floor(Math.random() * enchantPool.length);
  return enchantPool[randomIndex]!;
}

function calculateStats(
  material: PropertyWithChance,
  quality: PropertyWithChance,
  rarity: PropertyWithChance,
  aura?: PropertyWithChance,
  effect?: PropertyWithChance,
  enchants: Enchant[] = [],
): {
  value: Prisma.Decimal;
  damage: Prisma.Decimal;
  experience: Prisma.Decimal;
  luck: number;
} {
  // Base values
  let baseValue = 100;
  let baseDamage = 100;

  // Apply property multipliers
  baseValue *= material.valueMultiplier * quality.valueMultiplier * rarity.valueMultiplier;
  baseDamage *= (material.damageMultiplier ?? 1) * (quality.damageMultiplier ?? 1) * (rarity.damageMultiplier ?? 1);

  // Apply aura and effect multipliers if they exist
  if (aura) {
    baseValue *= aura.valueMultiplier;
    baseDamage *= aura.damageMultiplier ?? 1;
  }
  if (effect) {
    baseValue *= effect.valueMultiplier;
    baseDamage *= effect.damageMultiplier ?? 1;
  }

  // Apply enchant multipliers
  const enchantMultipliers = enchants.reduce(
    (acc, enchant) => ({
      value: acc.value * (enchant.valueMultiplier ?? 1),
      damage: acc.damage * (enchant.damageMultiplier ?? 1),
      experience: acc.experience * (enchant.experienceMultiplier ?? 1),
      luck: acc.luck * (enchant.luckMultiplier ?? 1),
    }),
    { value: 1, damage: 1, experience: 1, luck: 1 },
  );

  // Calculate final values
  const finalValue = Math.round(baseValue * enchantMultipliers.value);
  const finalDamage = Math.round(baseDamage * enchantMultipliers.damage);
  const finalExperience = Math.round(finalValue * 0.14 * enchantMultipliers.experience);
  const finalLuck = 100 * enchantMultipliers.luck;

  return {
    value: new Prisma.Decimal(finalValue),
    damage: new Prisma.Decimal(finalDamage),
    experience: new Prisma.Decimal(finalExperience),
    luck: finalLuck,
  };
}

export function generateRandomSword(totalLuck: number) {
  // Get random properties
  const material = getRandomProperty(Materials, totalLuck);
  const quality = getRandomProperty(Qualities, totalLuck);
  const rarity = getRandomProperty(Rarities, totalLuck);
  
  // Chance for aura/effect (20% base chance, modified by luck)
  const aura = calculateProbability(500, totalLuck) 
    ? getRandomProperty(Auras, totalLuck) 
    : undefined;
    
  const effect = calculateProbability(500, totalLuck)
    ? getRandomProperty(Effects, totalLuck)
    : undefined;

  // Generate 1-3 random enchants
  const enchantCount = 1 + Math.floor(Math.random() * 3);
  const enchants: Enchant[] = [];
  const usedEnchants = new Set<string>();

  while (enchants.length < enchantCount) {
    const enchant = getRandomEnchant();
    if (!usedEnchants.has(enchant.name)) {
      enchants.push(enchant);
      usedEnchants.add(enchant.name);
    }
  }

  // Calculate stats
  const stats = calculateStats(material, quality, rarity, aura, effect, enchants);

  // Create the sword object
  return {
    material: material.name,
    quality: quality.name,
    rarity: rarity.name,
    aura: aura?.name,
    effect: effect?.name,
    enchants: enchants,
    ...stats,
  };
}