export function experienceForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5)); // Level 1 requires 100 XP, increases with level^1.5
}

export function getLevelFromExperience(experience: number): number {
  // Formula: experience required for level n is baseExp * levelFactor^(n-1)
  const baseExp = 100; // Experience needed for level 1
  const levelFactor = 1.5; // How much more exp each level requires

  let level = 1;
  let expForNextLevel = baseExp;

  while (experience >= expForNextLevel) {
    experience -= expForNextLevel;
    level++;
    expForNextLevel = Math.floor(baseExp * Math.pow(levelFactor, level - 1));
  }

  return level;
}

export function getExperienceForNextLevel(currentLevel: number): number {
  const baseExp = 100;
  const levelFactor = 1.5;

  return Math.floor(baseExp * Math.pow(levelFactor, currentLevel - 1));
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

export function abbreviateNumber(num: number) {
  if (num < 1) return num.toFixed(1);

  const SYMBOL = ["", "k", "M", "B", "T", "Q", "Qn", "Sx", "Sp", "O", "N", "D"];
  const tier = Math.log10(num) / 3 | 0;

  if (tier === 0) return num.toFixed(1);

  const suffix = SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  const scaled = num / scale;
  const formatted = scaled.toFixed(1);

  return formatted + suffix;
}