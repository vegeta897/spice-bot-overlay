<script lang="ts">
	import TrainCar from './TrainCar.svelte'

	export let train: any

	const TRAIN_CAR_SIZE = 100
	const SCREEN_WIDTH = 1920

	let trainContainer: HTMLDivElement

	$: graces = train.graces.filter((g) => g.type !== 'end')
	$: {
		if (graces.length === 1 && !animation) {
			runTrain()
		}
	}

	let animation: Animation

	function slide(from: number, to: number) {
		const duration = ((from - to) / 100) * 15 * 1000
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
		let translation = 100
		let translatingTo = -100
		while (!train.offScreen) {
			await slide(translation, translatingTo)
			translation = translatingTo
			if (train.status === 'ended') {
				// If grace train finished, calculate how many more 100% needed to get off screen
				const trainSize = graces.length * TRAIN_CAR_SIZE
				const remainingPixels = (translation / 100) * SCREEN_WIDTH + trainSize
				if (remainingPixels > 0) {
					// Finish sliding
					const remainingPercent = remainingPixels / SCREEN_WIDTH
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

	// onDestroy(() => {
	// 	if (animation) animation.stop()
	// })
</script>

<div bind:this={trainContainer}>
	{#each graces as grace}
		<TrainCar />
	{/each}
</div>

<style>
	div {
		position: absolute;
		width: 1920px;
		white-space: nowrap;
		/* animation: cross-screen 30s linear infinite; */
	}

	@keyframes cross-screen {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(-100%);
		}
	}
</style>
