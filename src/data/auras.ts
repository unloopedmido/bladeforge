export type Aura = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
};

const Auras: Aura[] = [
  { name: "None", chance: 97.295, valueMultiplier: 1, damageMultiplier: 1 },
  { name: "Fire", chance: 2, valueMultiplier: 16, damageMultiplier: 25 },
  { name: "Ice", chance: 0.5, valueMultiplier: 64, damageMultiplier: 125 },
  { name: "Poison", chance: 0.15, valueMultiplier: 256, damageMultiplier: 625 },
  {
    name: "Electric",
    chance: 0.05,
    valueMultiplier: 1024,
    damageMultiplier: 3125,
  },
  {
    name: "Wind",
    chance: 0.005,
    valueMultiplier: 4096,
    damageMultiplier: 15625,
  },
];

export default Auras;
