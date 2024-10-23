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
  if (num === 0) return "0"; // Handle the zero case explicitly

  const SYMBOL = ["", "k", "M", "B", "T", "Q", "Qn", "Sx", "Sp", "O", "N", "D"];

  // Handle small numbers normally
  if (Math.abs(num) < 1) {
    return num.toFixed(2); // Display small numbers with fixed decimals
  }

  const tier = Math.floor(Math.log10(Math.abs(num)) / 3); // Compute the tier for large numbers

  // Limit to available symbols or dynamically generate based on tier
  const suffix = SYMBOL[tier] ?? `e${tier * 3}`; // Use predefined symbols or fallback
  const scale = Math.pow(10, tier * 3); // Scale the number based on the tier

  const scaled = num / scale;
  const formatted = scaled.toFixed(2); // Always keep 2 decimal places

  return formatted + suffix;
}

export function toPlainString(num: number): string {
  return num.toLocaleString("fullwide", { useGrouping: false });
}

export function hexToDecimal(hex: string): number {
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
  return parseInt(cleanHex, 16);
}
