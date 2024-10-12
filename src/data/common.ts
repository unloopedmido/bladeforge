export type Property = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier?: number;
};

export function luckFromLevel(level: number): number {
  return Math.pow(1.05, level); // Each level increases luck by a factor of 1.2
}

export function weekendLuck(): number {
  const date = new Date();
  const day = date.getDay();

  // 25% luck bonus on friday, saturday and sunday
  if (day === 5 || day === 6 || day === 0) return 1.25;

  return 1;
}

export function probability(chance: number, totalLuck: number): boolean {
  const pool = Math.random() * 100;
  return pool < 100 / (chance / totalLuck);
}

export function nonLuckProbability(chance: number) {
  return Math.random() * 100 < 100 / chance;
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

export function getSwordAura(aura: string): string {
  if(!aura) return "bastard.png";

  switch(aura.toLowerCase()) {
    case "fire":
      return "fire.png";
    case "electric":
      return "electric.png";
    case "glitch":
      return "glitch.png";
    case "wind":
      return "wind.png";
    case "light":
      return "light.png";
    default:
      return "bastard.png";
  }
}