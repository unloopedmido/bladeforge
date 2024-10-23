export type Quality = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
};

const Qualities: Quality[] = [
  "Inferior",
  "Ruined",
  "Broken",
  "Damaged",
  "Poor",
  "Scratched",
  "Worn",
  "Decent",
  "Sharp", // New Quality
  "Adequate",
  "Good",
  "Fine",
  "Very Good",
  "Balanced", // New Quality
  "Impressive", // New Quality
  "Remarkable", // New Quality
  "Polished", // New Quality
  "Great",
  "Superb",
  "Excellent",
  "Outstanding",
  "Exceptional", // New Quality
  "Pristine",
  "Flawless",
  "Perfect",
  "Legendary",
  "Divine", // New Quality
  "Durable", // New Quality
  "Godly",
  "Otherworldly",
  "Ascended",
  "Transcendent",
  "Exquisite",
  "Ultimate",
  "Mythical", // New Quality
  "Mastercrafted", // New Quality
].map((quality, index) => ({
  name: quality,
  chance: +Math.pow(3.2, index).toFixed(2), // 320% increase per quality level
  valueMultiplier: +Math.pow(1.7, index).toFixed(2), // 70% increase per quality level
  damageMultiplier: +Math.pow(1.7, index).toFixed(2), // 70% increase per quality level
}));

export default Qualities;
