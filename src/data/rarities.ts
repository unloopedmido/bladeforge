import type { Property } from "./common";

interface Rarity extends Property {
  name: string;
  color: string | string[];
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
}

const Rarities: Rarity[] = [
  { name: "Common", color: "rgb(128,128,128)" },
  { name: "Uncommon", color: "rgb(0,138,0)" },
  { name: "Rare", color: "rgb(0,0,138)" },
  { name: "Epic", color: "rgb(138,0,138)" },
  { name: "Legendary", color: "rgb(138,110,0)" },
  {
    name: "Mythical",
    color: ["rgb(138,0,0)", "rgb(255,255,255)", "rgb(138,0,0)"], // Triple
  },
  {
    name: "Ancient",
    color: ["rgb(255,215,0)", "rgb(255,140,0)"],
  },
  {
    name: "Celestial",
    color: ["rgb(173,216,230)", "rgb(135,206,235)", "rgb(240,248,255)"], // Triple
  },
  {
    name: "Fabled",
    color: ["rgb(75,0,130)", "rgb(148,0,211)"],
  },
  {
    name: "Forsaken",
    color: ["rgb(75,0,0)", "rgb(139,0,139)"], // Double
  },
  {
    name: "Shadow",
    color: ["rgb(0,0,0)", "rgb(105,105,105)"],
  },
  {
    name: "Glacial",
    color: [
      "rgb(173,216,230)",
      "rgb(240,248,255)",
      "rgb(135,206,235)",
      "rgb(255,250,250)",
    ], // Quadruple
  },
  {
    name: "Infernal",
    color: ["rgb(255,0,0)", "rgb(255,69,0)", "rgb(255,165,0)"], // Triple
  },
  {
    name: "Divine",
    color: ["rgb(255,223,186)", "rgb(255,200,124)", "rgb(250,235,215)"], // Triple
  },
  {
    name: "Spectral",
    color: ["rgb(153,50,204)", "rgb(102,205,170)"],
  },
  {
    name: "Temporal",
    color: ["rgb(135,206,235)", "rgb(70,130,180)", "rgb(240,248,255)"], // Triple
  },
  {
    name: "Mystic",
    color: ["rgb(186,85,211)", "rgb(147,112,219)"],
  },
  {
    name: "Radiant",
    color: ["rgb(255,255,0)", "rgb(255,215,0)", "rgb(255,240,245)"], // Triple
  },
  {
    name: "Primal",
    color: ["rgb(0,128,0)", "rgb(34,139,34)"],
  },
  {
    name: "Arcane",
    color: ["rgb(75,0,130)", "rgb(138,43,226)", "rgb(106,90,205)"], // Triple
  },
  {
    name: "Ethereal",
    color: ["rgb(0,255,255)", "rgb(0,206,209)"],
  },
  {
    name: "Titan",
    color: ["rgb(128,128,0)", "rgb(255,165,0)"],
  },
  {
    name: "Phoenix",
    color: ["rgb(255,140,0)", "rgb(255,69,0)", "rgb(255,165,79)"], // Triple
  },
  {
    name: "Dragon",
    color: ["rgb(255,0,255)", "rgb(128,0,128)"],
  },
  {
    name: "Guardian",
    color: ["rgb(0,255,0)", "rgb(154,205,50)", "rgb(0,128,0)"], // Triple
  },
  {
    name: "Chimeric",
    color: ["rgb(0,191,255)", "rgb(148,0,211)"], // Double
  },
  {
    name: "Noble",
    color: ["rgb(240,230,140)", "rgb(255,239,0)"],
  },
  {
    name: "Elysian",
    color: ["rgb(248,248,255)", "rgb(240,248,255)", "rgb(230,230,250)"], // Triple
  },
  {
    name: "Seraphic",
    color: ["rgb(255,192,203)", "rgb(255,105,180)"],
  },
  {
    name: "Veiled",
    color: ["rgb(102,102,102)", "rgb(128,0,128)"], // Double
  },
  {
    name: "Abyssal",
    color: [
      "rgb(0,0,128)",
      "rgb(0,0,205)",
      "rgb(25,25,112)",
      "rgb(70,130,180)",
    ], // Quadruple
  },
  {
    name: "Enigmatic",
    color: ["rgb(128,0,128)", "rgb(75,0,130)", "rgb(255,105,180)"], // Triple
  },
  {
    name: "Tempest",
    color: ["rgb(0,0,255)", "rgb(135,206,250)", "rgb(70,130,180)"], // Triple
  },
  {
    name: "Wraith",
    color: ["rgb(47,79,79)", "rgb(112,128,144)"], // Double
  },
  {
    name: "Savage",
    color: ["rgb(128,0,0)", "rgb(255,99,71)"], // Double
  },
  {
    name: "Hallowed",
    color: ["rgb(255,250,205)", "rgb(255,255,240)"], // Double
  },
  {
    name: "Rune",
    color: ["rgb(192,192,255)", "rgb(138,43,226)"], // Double
  },
  {
    name: "Vengeful",
    color: ["rgb(255,0,255)", "rgb(128,0,0)", "rgb(0,0,0)"], // Triple
  },
  {
    name: "Eclipse",
    color: ["rgb(75,0,130)", "rgb(0,0,0)", "rgb(169,169,169)"], // Triple
  },
  {
    name: "Nebula",
    color: ["rgb(0,0,128)", "rgb(75,0,130)"], // Double
  },
  {
    name: "Zephyr",
    color: ["rgb(173,216,230)", "rgb(135,206,250)"], // Double
  },
].map((rarity, index) => ({
  name: rarity.name,
  color: rarity.color,
  chance: +Math.pow(4.1, index).toFixed(2), // 410% increase per rarity level
  valueMultiplier: +Math.pow(1.9, index).toFixed(2), // 90% increase per rarity level
  damageMultiplier: +Math.pow(2.1, index).toFixed(2), // 45% increase per rarity level
}));

export default Rarities;
