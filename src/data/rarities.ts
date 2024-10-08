export type Rarity = {
  name: string;
  color: string | string[];
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
};

const Rarities: Rarity[] = [
  { name: "Common", color: "rgb(128,128,128)" },
  { name: "Uncommon", color: "rgb(0,138,0)" },
  { name: "Rare", color: "rgb(0,0,138)" },
  { name: "Epic", color: "rgb(138,0,138)" },
  { name: "Legendary", color: "rgb(138,110,0)" },
  {
    name: "Mythical",
    color: ["rgb(138,0,0)", "rgb(255,255,255)", "rgb(138,0,0)"],
  },
  {
    name: "Ancient",
    color: ["rgb(255,215,0)", "rgb(255,140,0)"],
  },
  {
    name: "Celestial",
    color: ["rgb(173,216,230)", "rgb(135,206,235)"],
  },
  {
    name: "Fabled",
    color: ["rgb(75,0,130)", "rgb(148,0,211)"],
  },
  {
    name: "Shadow",
    color: ["rgb(0,0,0)", "rgb(105,105,105)"],
  },
  {
    name: "Glacial",
    color: ["rgb(173,216,230)", "rgb(240,248,255)"],
  },
  {
    name: "Infernal",
    color: ["rgb(255,0,0)", "rgb(255,69,0)"],
  },
  {
    name: "Divine",
    color: ["rgb(255,223,186)", "rgb(255,200,124)"],
  },
  {
    name: "Spectral",
    color: ["rgb(153,50,204)", "rgb(102,205,170)"],
  },
  {
    name: "Mystic",
    color: ["rgb(186,85,211)", "rgb(147,112,219)"],
  },
  {
    name: "Radiant",
    color: ["rgb(255,255,0)", "rgb(255,215,0)"],
  },
  {
    name: "Primal",
    color: ["rgb(0,128,0)", "rgb(34,139,34)"],
  },
  {
    name: "Arcane",
    color: ["rgb(75,0,130)", "rgb(138,43,226)"],
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
    color: ["rgb(255,140,0)", "rgb(255,69,0)"],
  },
  {
    name: "Dragon",
    color: ["rgb(255,0,255)", "rgb(128,0,128)"],
  },
  {
    name: "Guardian",
    color: ["rgb(0,255,0)", "rgb(154,205,50)"],
  },
  {
    name: "Noble",
    color: ["rgb(240,230,140)", "rgb(255,239,0)"],
  },
  {
    name: "Elysian",
    color: ["rgb(248,248,255)", "rgb(240,248,255)"],
  },
  {
    name: "Seraphic",
    color: ["rgb(255,192,203)", "rgb(255,105,180)"],
  },
].map((rarity, index) => ({
  name: rarity.name,
  color: rarity.color,
  chance: +Math.pow(3, index + 1).toFixed(2), // 300% increase per rarity level
  valueMultiplier: +Math.pow(2.1, index).toFixed(2), // 210% increase per rarity level
  damageMultiplier: +Math.pow(1.5, index).toFixed(2), // 50% increase per rarity level
}));

export default Rarities;
