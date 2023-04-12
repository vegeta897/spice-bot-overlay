import { onDestroy } from 'svelte'

export const randomIntRange = (minOrMax: number, max?: number) => {
	const min = max === undefined ? 0 : minOrMax
	const range = max === undefined ? minOrMax : max - minOrMax
	return Math.floor(min + Math.random() * range)
}

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))

// https://svelte.dev/tutorial/ondestroy
// Must be called during component initialization, not in onMount
export const onInterval = (callback: () => void, ms: number) => {
	const interval = setInterval(callback, ms)
	onDestroy(() => clearInterval(interval))
}
