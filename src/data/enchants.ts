export type Enchant = {
  name: string;
  color: string | string[];
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
  luckMultiplier: number;
  experienceMultiplier: number;
  tier: number;
};

const Enchants: Enchant[] = [
  // Tier 1 Enchants (40% total)
  {
    name: "Fortune",
    color: "rgb(192,192,192)",
    chance: 10,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 1.25,
    experienceMultiplier: 0,
    tier: 1,
  },
  {
    name: "Abundance",
    color: "rgb(144,238,144)",
    chance: 10,
    valueMultiplier: 1.25,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 1,
  },
  {
    name: "Insight",
    color: "rgb(173,216,230)",
    chance: 10,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 1.25,
    tier: 1,
  },
  {
    name: "Sharpness",
    color: "rgb(139,0,0)",
    chance: 10,
    valueMultiplier: 0,
    damageMultiplier: 1.25,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 1,
  },

  // Tier 2 Enchants (30% total)
  {
    name: "Blessing",
    color: "rgb(192,192,192)",
    chance: 7.5,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 1.5,
    experienceMultiplier: 0,
    tier: 2,
  },
  {
    name: "Wealth",
    color: "rgb(144,238,144)",
    chance: 7.5,
    valueMultiplier: 1.5,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 2,
  },
  {
    name: "Wisdom",
    color: "rgb(173,216,230)",
    chance: 7.5,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 1.5,
    tier: 2,
  },
  {
    name: "Precision",
    color: "rgb(139,0,0)",
    chance: 7.5,
    valueMultiplier: 0,
    damageMultiplier: 1.5,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 2,
  },

  // Tier 3 Enchants (16% total)
  {
    name: "Fate",
    color: [
      "rgb(255,215,0)",
      "rgb(218,165,32)",
      "rgb(184,134,11)",
      "rgb(139,69,19)",
    ],
    chance: 4,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 2,
    experienceMultiplier: 0,
    tier: 3,
  },
  {
    name: "Legacy",
    color: ["rgb(50,205,50)", "rgb(34,139,34)", "rgb(0,100,0)", "rgb(0,128,0)"],
    chance: 4,
    valueMultiplier: 2,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 3,
  },
  {
    name: "Clarity",
    color: [
      "rgb(135,206,250)",
      "rgb(30,144,255)",
      "rgb(0,191,255)",
      "rgb(65,105,225)",
    ],
    chance: 4,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 2,
    tier: 3,
  },
  {
    name: "Edge",
    color: [
      "rgb(255,69,0)",
      "rgb(255,99,71)",
      "rgb(233,150,122)",
      "rgb(205,92,92)",
    ],
    chance: 4,
    valueMultiplier: 0,
    damageMultiplier: 2,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 3,
  },

  // Tier 4 Enchants (10% total)
  {
    name: "Divinity",
    color: [
      "rgb(255,255,240)",
      "rgb(255,250,240)",
      "rgb(240,255,240)",
      "rgb(240,248,255)",
      "rgb(240,255,255)",
    ],
    chance: 2.5,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 5,
    experienceMultiplier: 0,
    tier: 4,
  },
  {
    name: "Empire",
    color: [
      "rgb(255,215,0)",
      "rgb(255,165,0)",
      "rgb(255,140,0)",
      "rgb(255,127,80)",
      "rgb(255,99,71)",
    ],
    chance: 2.5,
    valueMultiplier: 5,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 4,
  },
  {
    name: "Sage",
    color: [
      "rgb(0,250,154)",
      "rgb(0,255,127)",
      "rgb(60,179,113)",
      "rgb(46,139,87)",
      "rgb(32,178,170)",
    ],
    chance: 2.5,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 5,
    tier: 4,
  },
  {
    name: "Mastery",
    color: [
      "rgb(128,0,128)",
      "rgb(148,0,211)",
      "rgb(153,50,204)",
      "rgb(186,85,211)",
      "rgb(218,112,214)",
    ],
    chance: 2.5,
    valueMultiplier: 0,
    damageMultiplier: 5,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 4,
  },

  // Tier 5 Enchants (4% total)
  {
    name: "Celestial",
    color: [
      "rgb(173,216,230)",
      "rgb(135,206,235)",
      "rgb(0,191,255)",
      "rgb(30,144,255)",
      "rgb(0,0,255)",
      "rgb(0,0,139)",
    ],
    chance: 0.85,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 8,
    experienceMultiplier: 0,
    tier: 5,
  },
  {
    name: "Infinity",
    color: [
      "rgb(255,192,203)",
      "rgb(255,182,193)",
      "rgb(255,105,180)",
      "rgb(255,20,147)",
      "rgb(199,21,133)",
      "rgb(139,0,139)",
    ],
    chance: 1,
    valueMultiplier: 8,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 5,
  },
  {
    name: "Transcendence",
    color: [
      "rgb(255,255,0)",
      "rgb(255,215,0)",
      "rgb(255,165,0)",
      "rgb(255,69,0)",
      "rgb(255,0,0)",
      "rgb(139,0,0)",
    ],
    chance: 0.85,
    valueMultiplier: 0,
    damageMultiplier: 0,
    luckMultiplier: 0,
    experienceMultiplier: 8,
    tier: 5,
  },
  {
    name: "Legendary",
    color: [
      "rgb(0,255,255)",
      "rgb(0,206,209)",
      "rgb(0,139,139)",
      "rgb(0,128,128)",
      "rgb(47,79,79)",
      "rgb(0,0,0)",
    ],
    chance: 1,
    valueMultiplier: 0,
    damageMultiplier: 8,
    luckMultiplier: 0,
    experienceMultiplier: 0,
    tier: 5

  },
  // Tier 6 (one for all)
  {
    name: "Omniscient",
    color: ["rgb(255,255,255)", "rgb(0,0,0)"],
    chance: 0.15,
    valueMultiplier: 12,
    damageMultiplier: 12,
    luckMultiplier: 12,
    experienceMultiplier: 12,
    tier: 6
  },
];

export default Enchants;
