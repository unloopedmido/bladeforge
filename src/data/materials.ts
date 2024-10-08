export type Material = {
  name: string;
  color: string | string[];
  chance: number;
  valueMultiplier: number;
};

const Materials: Material[] = [
  { name: "Rubber", color: "rgb(200,200,200)" },
  { name: "Plastic", color: "rgb(150,150,150)" },
  { name: "Wood", color: "rgb(150,77,2)" },
  { name: "Cobblestone", color: "rgb(100,100,100)" },
  { name: "Iron", color: ["rgb(139,137,137)", "rgb(100,100,100)"] },
  { name: "Copper", color: ["rgb(184,115,51)", "rgb(206,124,24)"] },
  { name: "Bronze", color: ["rgb(205,127,50)", "rgb(153,101,21)"] },
  { name: "Steel", color: ["rgb(189,189,189)", "rgb(140,140,140)"] },
  { name: "Aluminum", color: ["rgb(211,211,211)", "rgb(150,150,150)"] },
  { name: "Zinc", color: ["rgb(157,157,157)", "rgb(110,110,110)"] },
  { name: "Lead", color: ["rgb(105,105,105)", "rgb(70,70,70)"] },
  { name: "Titanium", color: ["rgb(196,196,196)", "rgb(160,160,160)"] },
  { name: "Gold", color: ["rgb(255,215,0)", "rgb(184,134,11)"] },
  { name: "Platinum", color: ["rgb(229,228,226)", "rgb(192,192,192)"] },
  {
    name: "Diamond",
    color: ["rgb(240,248,255)", "rgb(173,216,230)", "rgb(255,255,255)"],
  },
  {
    name: "Emerald",
    color: ["rgb(80,200,120)", "rgb(0,128,0)", "rgb(0,100,0)"],
  },
  { name: "Ruby", color: ["rgb(255,0,0)", "rgb(139,0,0)"] },
  { name: "Sapphire", color: ["rgb(15,82,186)", "rgb(0,0,139)"] },
  {
    name: "Carbon Fiber",
    color: ["rgb(70,70,70)", "rgb(100,100,100)", "rgb(130,130,130)"],
  },
  { name: "Glass", color: ["rgb(100,200,250)", "rgb(50,100,150)"] },
  { name: "Obsidian", color: ["rgb(20,20,20)", "rgb(40,40,40)"] },
].map((material, index) => ({
  name: material.name,
  color: material.color,
  chance: +Math.pow(3.2, index).toFixed(2), // 320% increase per material level
  valueMultiplier: +Math.pow(2, index).toFixed(2), // 200% increase per material level
}));

export default Materials;
