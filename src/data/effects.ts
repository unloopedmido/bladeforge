export type Effect = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
  color: string;
};

const Effects: Effect[] = [
  {
    name: "None",
    chance: 69.65,
    valueMultiplier: 1,
    damageMultiplier: 1,
    color: "rgb(0,0,0)",
  },
  {
    name: "Shiny",
    chance: 25,
    valueMultiplier: 2,
    damageMultiplier: 2,
    color: "rgb(255,255,0)",
  },
  {
    name: "Runic",
    chance: 5,
    valueMultiplier: 5,
    damageMultiplier: 5,
    color: "rgb(100,0,255)",
  },
  {
    name: "Cold",
    chance: 0.25,
    valueMultiplier: 10,
    damageMultiplier: 10,
    color: "rgb(0,200,255)",
  },
  {
    name: "Burning",
    chance: 0.1,
    valueMultiplier: 25,
    damageMultiplier: 25,
    color: "rgb(255,0,0)",
  },
  {
    name: "Rich",
    chance: 0.05,
    valueMultiplier: 50,
    damageMultiplier: 1,
    color: "rgb(0,255,0)",
  },
];

export default Effects;
