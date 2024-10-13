export type Aura = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
  color: string[];
};

const Auras: Aura[] = [
  { name: "None", chance: 92.3, valueMultiplier: 1, damageMultiplier: 1, color: ["#FFFFFF", "#F0F0F0"] },
  { name: "Fire", chance: 5, valueMultiplier: 16, damageMultiplier: 25, color: ["#FF4500", "#FF6347"] },
  { name: "Electric", chance: 2, valueMultiplier: 64, damageMultiplier: 125, color: ["#0077FF", "#00BFFF"] },
  { name: "Light", chance: 0.5, valueMultiplier: 256, damageMultiplier: 625, color: ["#FFD700", "#FFFACD"] },
  {
    name: "Snow",
    chance: 0.15,
    valueMultiplier: 1024,
    damageMultiplier: 3125,
    color: ["#ADD8E6", "#E0FFFF"],
  },
  {
    name: "Glitch",
    chance: 0.05,
    valueMultiplier: 4096,
    damageMultiplier: 15625,
    color: ["#8A2BE2", "#DDA0DD"],
  },
];

export default Auras;
