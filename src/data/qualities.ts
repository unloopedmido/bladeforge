export type Quality = {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
};

const Qualities: Quality[] = [
  "Ruined",
  "Broken",
  "Damaged",
  "Poor",
  "Scratched",
  "Worn",
  "Decent",
  "Adequate",
  "Good",
  "Fine",
  "Very Good",
  "Great",
  "Superb",
  "Excellent",
  "Outstanding",
  "Pristine",
  "Flawless",
  "Perfect",
  "Masterwork",
  "Legendary",
  "Godly",
  "Otherworldly",
  "Ascended",
  "Transcendent",
  "Exquisite",
  "Unparalleled",
  "Ultimate",
].map((quality, index) => ({
  name: quality,
  chance: +Math.pow(3.2, index).toFixed(2), // 320% increase per quality level
  valueMultiplier: +Math.pow(1.7, index).toFixed(2), // 70% increase per quality level
  damageMultiplier: +Math.pow(1.7, index).toFixed(2), // 70% increase per quality level
}));

export default Qualities;
