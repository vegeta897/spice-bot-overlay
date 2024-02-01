import type { HypeProgress } from 'grace-train-lib/data'

export function normalizeContribution({ type, amount, color }: HypeProgress) {
	const normalized: HypeProgress[] = []
	const normalizeSubs = type === 'subs' && amount > 1
	const normalizeBits = type === 'bits' && amount > 500
	if (normalizeSubs) {
		for (let i = 0; i < amount; i++) {
			normalized.push({ type, amount: 1, color })
		}
	} else if (normalizeBits) {
		const bitContributions = Math.floor(amount / 500)
		for (let i = 0; i < bitContributions; i++) {
			normalized.push({ type, amount: 500, color })
		}
		const bitRemainder = amount - bitContributions * 500
		if (bitRemainder >= 100) normalized.push({ type, color, amount: bitRemainder })
	} else {
		normalized.push({ type, amount, color })
	}
	return normalized
}

function normalizeContributions(contributions: HypeProgress[]) {
	const normalized: HypeProgress[] = []
	for (const contribution of contributions) {
		normalized.push(...normalizeContribution(contribution))
	}
	return normalized
}

export function normalizeHypeData<T extends { contributions: HypeProgress[] }>(hype: T) {
	return {
		...hype,
		contributions: normalizeContributions(hype.contributions),
	} as T
}
