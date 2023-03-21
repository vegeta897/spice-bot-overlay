<script lang="ts">
	import { graceTrains } from './store'
	import TrainCar from './TrainCar.svelte'
	// import { animate, linear } from 'popmotion'
	// import { onMount, onDestroy } from 'svelte'

	let trainContainer: HTMLDivElement

	// let animation: ReturnType<typeof animate>

	// onMount(() => {
	// 	// TODO: Try to replace this with css animations
	// 	// This is kind of cpu-hungry
	// 	animation = animate({
	// 		from: '100%',
	// 		to: '-100%',
	// 		duration: 30 * 1000,
	// 		ease: linear,
	// 		repeat: Infinity,
	// 		onUpdate: (latest) => {
	// 			trainContainer.style.transform = `translateX(${latest})`
	// 		},
	// 	})
	// })
	// onDestroy(() => {
	// 	if (animation) animation.stop()
	// })
</script>

<div bind:this={trainContainer}>
	{#each $graceTrains as grace}
		<TrainCar />
	{/each}
</div>

<style>
	div {
		display: flex;
		height: 100%;
		align-items: flex-end;
		animation: cross-screen 30s linear infinite;
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
