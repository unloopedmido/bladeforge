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
].map((quality, index) => ({
  name: quality,
  chance: +Math.pow(2.5, index).toFixed(2), // 250% increase per quality level
  valueMultiplier: +Math.pow(1.8, index).toFixed(2), // 50% increase per quality level
  damageMultiplier: +Math.pow(1.8, index).toFixed(2), // 80% increase per quality level
}));

export default Qualities;
