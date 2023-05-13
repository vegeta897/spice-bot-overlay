import { onDestroy } from 'svelte'

export const randomRange = (minOrMax: number, max?: number) => {
	const min = max === undefined ? 0 : minOrMax
	const range = max === undefined ? minOrMax : max - minOrMax
	return min + Math.random() * range
}

export const randomIntRange = (minOrMax: number, max?: number) => {
	if (max === undefined) return Math.floor(randomRange(minOrMax + 1))
	return Math.floor(randomRange(minOrMax, max + 1))
}

export const randomElement = <T>(arr: T[]): T => arr[randomIntRange(0, arr.length - 1)]

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// https://svelte.dev/tutorial/ondestroy
// Must be called during component initialization, not in onMount
export const onInterval = (callback: () => void, ms: number) => {
	const interval = setInterval(callback, ms)
	onDestroy(() => clearInterval(interval))
}

export const clamp = (val: number, min: number, max: number) =>
	Math.min(Math.max(val, min), max)

// https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone?view=azure-node-latest
export type RequireAtLeastOne<T> = {
	[K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]
