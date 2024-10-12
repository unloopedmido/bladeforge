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
    chance: 72.75,
    valueMultiplier: 1,
    damageMultiplier: 1,
    color: "rgb(0,0,0)",
  },
  {
    name: "Shiny",
    chance: 25,
    valueMultiplier: 2,
    damageMultiplier: 2,
    color: "rgb(255,255,255)",
  },
  {
    name: "Runic",
    chance: 2,
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
];

export default Effects;
