<script lang="ts">
	import { graces } from './store'
	import TrainCar from './TrainCar.svelte'
	import { animate, linear } from 'popmotion'
	import { onMount, onDestroy } from 'svelte'

	let trainContainer: HTMLDivElement

	let animation: ReturnType<typeof animate>

	onMount(() => {
		animation = animate({
			from: '100%',
			to: '-100%',
			duration: 20 * 1000,
			ease: linear,
			repeat: Infinity,
			onUpdate: (latest) => {
				trainContainer.style.transform = `translateX(${latest})`
			},
		})
	})
	onDestroy(() => {
		if (animation) animation.stop()
	})
</script>

<div bind:this={trainContainer}>
	{#each $graces as grace}
		<TrainCar />
	{/each}
</div>

<style>
	div {
		display: flex;
		height: 100%;
		align-items: flex-end;
	}
</style>
