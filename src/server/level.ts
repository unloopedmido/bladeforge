const BASE_EXP = 150;
const MIN_LEVEL_FACTOR = 1.12;
const LEVEL_FACTOR_INCREMENT = 0.008;

export function experienceForLevel(level: number): number {
	const levelFactor = MIN_LEVEL_FACTOR + level * LEVEL_FACTOR_INCREMENT;
	const baseScaling = Math.pow(levelFactor, level - 1);

	// Early level boost (levels 1-20)
	const earlyBoostFactor = level <= 20 ? (21 - level) / 20 : 0;
	const earlyBoost = BASE_EXP * earlyBoostFactor * 0.2;

	return Math.floor(BASE_EXP * baseScaling + earlyBoost);
}

const LEVEL_FACTORS = new Array(200) // Increased from 100 to support higher levels
	.fill(0)
	.map((_, i) => MIN_LEVEL_FACTOR + (i + 1) * LEVEL_FACTOR_INCREMENT);

export function getLevelFromExperience(experience: number): number {
	let left = 1;
	let right = 150; // Increased maximum level

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const levelFactor =
			LEVEL_FACTORS[mid - 1] ?? MIN_LEVEL_FACTOR + mid * LEVEL_FACTOR_INCREMENT;
		const expForLevel = Math.floor(BASE_EXP * Math.pow(levelFactor, mid - 1));

		if (expForLevel <= experience) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return left - 1;
}

export function getExperienceForNextLevel(currentLevel: number): number {
	return experienceForLevel(currentLevel + 1);
}
