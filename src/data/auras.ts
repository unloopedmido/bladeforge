export type Aura = {
	name: string;
	chance: number;
	valueMultiplier: number;
	damageMultiplier: number;
};

const Auras: Aura[] = [
	{ name: "Fire" },
	{ name: "Ice" },
	{ name: "Poison" },
	{ name: "Electric" },
	{ name: "Wind" },
].map((aura, index) => ({
	name: aura.name,
	chance: +Math.pow(12, index + 2).toFixed(2), // 1200% increase per aura level
	valueMultiplier: +Math.pow(4, index + 2).toFixed(2), // 400% increase per aura level
	damageMultiplier: +Math.pow(4, index + 2).toFixed(2), // 400% increase per aura level
}));

export default Auras;
