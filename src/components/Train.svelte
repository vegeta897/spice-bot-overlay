<script lang="ts">
	import TrainCar from './TrainCar.svelte'
	import Smoke from './Smoke.svelte'
	import { SCREEN, TRAIN } from '../lib/constants'

	export let train: any

	const secondsPerScreen = Math.round(SCREEN.width / TRAIN.speed)

	let trainContainer: HTMLDivElement

	$: graces = train.graces.filter((g) => g.type !== 'end')
	$: if (graces.length === 1 && !animation) runTrain()

	const maxHops = 8
	let lastImpulse = 0
	let cars: TrainCar[] = []
	$: if (cars.length > 0) impulse()
	let showSmoke = false

	function impulse() {
		const now = Date.now()
		for (let i = cars.length - 1; i >= 0; i--) {
			const fromEnd = cars.length - i - 1
			if (fromEnd > 0 && now - lastImpulse < 400) return
			if (fromEnd >= maxHops) break
			cars[i].hop(fromEnd * 100, (maxHops - fromEnd) / maxHops)
		}
		lastImpulse = now
	}

	let animation: Animation

	function slide(from: number, to: number) {
		const duration = ((from - to) / 100) * secondsPerScreen * 1000
		return new Promise((resolve) => {
			animation = trainContainer.animate(
				[
					{ transform: `translateX(${from}%)` },
					{ transform: `translateX(${to}%)` },
				],
				{ duration, easing: 'linear', fill: 'forwards' }
			)
			animation.onfinish = resolve
		})
	}

	async function runTrain() {
		showSmoke = true
		let translation = 100
		let translatingTo = -100
		while (!train.offScreen) {
			await slide(translation, translatingTo)
			translation = translatingTo
			if (translation === -100) showSmoke = false
			if (train.status === 'ended') {
				// If grace train finished, calculate how many more 100% needed to get off screen
				const trainSize =
					TRAIN.engineWidth + (graces.length - 1) * TRAIN.carWidth
				const remainingPixels = (translation / 100) * SCREEN.width + trainSize
				if (remainingPixels > 0) {
					// Finish sliding
					const remainingPercent = remainingPixels / SCREEN.width
					translatingTo = Math.round(translation - remainingPercent * 100)
					await slide(translation, translatingTo)
				}
				train.offScreen = true
			} else {
				// If not finished, animate another 100%
				translatingTo = translation - 100
			}
		}
	}
</script>

<div bind:this={trainContainer}>
	{#each graces as grace, g}
		<TrainCar
			color={grace.userColor}
			type={g === 0 ? 'engine' : 'car'}
			bind:this={cars[g]}
		/>
	{/each}
	{#if showSmoke}
		<Smoke />
	{/if}
</div>

<style>
	div {
		position: absolute;
		width: 100%;
		white-space: nowrap;
	}
</style>
