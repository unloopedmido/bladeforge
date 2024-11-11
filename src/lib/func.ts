const BASE_EXP = 150; // Increased from 100 to make early levels more rewarding
const MIN_LEVEL_FACTOR = 1.12; // Reduced from 1.15 to make level scaling more gradual
const LEVEL_FACTOR_INCREMENT = 0.008; // Reduced from 0.01 to smooth out progression

export function experienceForLevel(level: number): number {
  const levelFactor = MIN_LEVEL_FACTOR + level * LEVEL_FACTOR_INCREMENT;
  const baseScaling = Math.pow(levelFactor, level - 1);

  // Early level boost (levels 1-20)
  const earlyBoostFactor = level <= 20 ? (21 - level) / 20 : 0;
  const earlyBoost = BASE_EXP * earlyBoostFactor * 0.2;

  return Math.floor(BASE_EXP * baseScaling + earlyBoost);
}

const LEVEL_FACTORS = new Array(150) // Increased from 100 to support higher levels
  .fill(0)
  .map((_, i) => MIN_LEVEL_FACTOR + (i + 1) * LEVEL_FACTOR_INCREMENT);

export function getLevelFromExperience(experience: number): number {
  let left = 1;
  let right = 150; // Increased maximum level

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const levelFactor =
      LEVEL_FACTORS[mid - 1] ?? MIN_LEVEL_FACTOR + mid * LEVEL_FACTOR_INCREMENT;
    const expForLevel = Math.floor(BASE_EXP * Math.pow(levelFactor, mid - 1));

    if (expForLevel <= experience) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left - 1;
}

export function getExperienceForNextLevel(currentLevel: number): number {
  return experienceForLevel(currentLevel + 1);
}

export function rgba(rgb: string, alpha: number): string {
  return rgb.replace("rgb", "rgba").replace(")", `,${alpha})`);
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

// Only optimization worth making is precomputing suffixes
const SYMBOL = ["", "k", "M", "B", "T", "Q", "Qn", "Sx", "Sp", "O", "N", "D"];

export function abbreviateNumber(string: string) {
  const num = Number(string);
  if (num === 0) return "0";
  if (Math.abs(num) < 1) return num.toFixed(2);

  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  const suffix = SYMBOL[tier] ?? `e${tier * 3}`;
  const scale = Math.pow(10, tier * 3);

  return (num / scale).toFixed(2) + suffix;
}

export function toPlainString(num: number): string {
  return num.toLocaleString("fullwide", { useGrouping: false });
}

export function hexToDecimal(hex: string): number {
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
  return parseInt(cleanHex, 16);
}
