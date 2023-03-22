<script lang="ts">
	import TrainCar from './TrainCar.svelte'
	// import { animate, linear } from 'popmotion'
	// import { onMount, onDestroy } from 'svelte'

	export let train: any

	let trainContainer: HTMLDivElement

	$: graces = train.graces.filter((g) => g.type !== 'end')

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
	{#each graces as grace}
		<TrainCar />
	{/each}
</div>

<style>
	div {
		position: absolute;
		width: 1920px;
		white-space: nowrap;
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
