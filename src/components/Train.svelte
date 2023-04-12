<script lang="ts">
	import TrainCar from './TrainCar.svelte'
	import Smoke from './Smoke.svelte'
	import { SCREEN, TRAIN } from '../lib/constants'
	import { sleep } from '../lib/util'
	import { getTrainWidth, type Train } from '../lib/trains'
	import { onMount } from 'svelte'

	export let train: Train
	export let top = false

	const secondsPerScreen = Math.round(SCREEN.width / TRAIN.speed)

	let trainContainer: HTMLDivElement

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
	let offScreen = false

	function slide(from: number, to: number) {
		if (!trainContainer) return
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

	onMount(async () => {
		const wait = train.departTime - Date.now()
		if (wait > 0) await sleep(wait)
		showSmoke = true
		let translation = 100
		let translatingTo = -100
		while (trainContainer && !offScreen) {
			await slide(translation, translatingTo)
			translation = translatingTo
			if (translation === -100) showSmoke = false
			if (train.endUser) {
				// If grace train finished, calculate how many more 100% needed to get off screen
				const trainWidth = getTrainWidth(train.combo)
				const remainingPixels = (translation / 100) * SCREEN.width + trainWidth
				if (remainingPixels > 0) {
					// Finish sliding
					const remainingPercent = remainingPixels / SCREEN.width
					translatingTo = Math.round(translation - remainingPercent * 100)
					await slide(translation, translatingTo)
				}
				offScreen = true
			} else {
				// If not finished, animate another 100%
				translatingTo = translation - 100
			}
		}
	})
</script>

<div bind:this={trainContainer} class:top>
	{#each train.colors as color, c (c)}
		<TrainCar {color} type={c === 0 ? 'engine' : 'car'} bind:this={cars[c]} />
	{/each}
	{#if showSmoke && !top}
		<Smoke />
	{/if}
</div>

<style>
	div {
		position: absolute;
		bottom: 0;
		width: 100%;
		white-space: nowrap;
		transform: translateX(100%);
		--train-base-color: #605de9;
		--train-pop-color: #ff538f;
	}
	div.top {
		bottom: auto;
		top: 4px;
	}
</style>
