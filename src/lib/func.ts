export function experienceForLevel(level: number): number {
  const baseExp = 100; // Base experience for level 1
  const levelFactor = 1.15 + level * 0.01; // Progressive factor that starts low and increases

  return Math.floor(baseExp * Math.pow(levelFactor, level - 1));
}

export function getLevelFromExperience(experience: number): number {
  const baseExp = 100;
  let level = 1;
  let expForNextLevel = baseExp;

  while (experience >= expForNextLevel) {
    experience -= expForNextLevel;
    level++;
    const levelFactor = 1.15 + level * 0.01; // Matches the experienceForLevel function
    expForNextLevel = Math.floor(baseExp * Math.pow(levelFactor, level - 1));
  }

  return level;
}

export function getExperienceForNextLevel(currentLevel: number): number {
  const baseExp = 100;
  const levelFactor = 1.15 + currentLevel * 0.01; // Progressive factor that grows with level

  return Math.floor(baseExp * Math.pow(levelFactor, currentLevel - 1));
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

export function abbreviateNumber(string: string) {
  const num = Number(string);
  if (num < 1) return num.toFixed(1);

  const SYMBOL = ["", "k", "M", "B", "T", "Q", "Qn", "Sx", "Sp", "O", "N", "D"];
  const tier = (Math.log10(num) / 3) | 0;

  if (tier === 0) return num.toFixed(2);

  const suffix = SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  const scaled = num / scale;
  const formatted = scaled.toFixed(2);

  return formatted + suffix;
}
