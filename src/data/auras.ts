export type Aura = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
  color: string[];
};

const Auras: Aura[] = [
  {
    name: "None",
    chance: 85,
    valueMultiplier: 1,
    damageMultiplier: 1,
    color: ["#FFFFFF", "#F0F0F0"],
  },
  {
    name: "Fire",
    chance: 8,
    valueMultiplier: 10,
    damageMultiplier: 15,
    color: ["#FF4500", "#FF6347"],
  },
  {
    name: "Electric",
    chance: 5,
    valueMultiplier: 30,
    damageMultiplier: 60,
    color: ["#0077FF", "#00BFFF"],
  },
  {
    name: "Light",
    chance: 1,
    valueMultiplier: 100,
    damageMultiplier: 250,
    color: ["#FFFF00", "#FFFF00"],
  },
  {
    name: "Snow",
    chance: 0.5,
    valueMultiplier: 400,
    damageMultiplier: 1000,
    color: ["#ADD8E6", "#E0FFFF"],
  },
  {
    name: "Glitch",
    chance: 0.2,
    valueMultiplier: 1600,
    damageMultiplier: 4000,
    color: ["#8A2BE2", "#DDA0DD"],
  },
  {
    name: "Vortex",
    chance: 0.1,
    valueMultiplier: 6400,
    damageMultiplier: 16000,
    color: ["#E0FFFF", "#DDA0DD"],
  },
  {
    name: "Aegis",
    chance: 0.05,
    valueMultiplier: 25600,
    damageMultiplier: 62500,
    color: ["#FFD700", "#FFFACD"],
  },
  {
    name: "Godsent",
    chance: 0.01,
    valueMultiplier: 102400,
    damageMultiplier: 156250,
    color: ["#ADD8E6", "#fff"],
  },
];

export default Auras;
