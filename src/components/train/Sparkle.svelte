<script lang="ts">
	import { onMount } from 'svelte'
	import { sleep, randomIntRange, randomElement } from '../../lib/util'

	export let coords: [number, number][]

	$: translations = coords.map(([x, y]) => `translate(${x}px, ${y}px)`)

	let element: SVGPathElement

	onMount(async () => {
		while (element) {
			await sleep(randomIntRange(9, 20) * 100)
			if (!element) break
			const translate = randomElement(translations)
			element.animate(
				[
					{ transform: `${translate} rotate(0) scale(0.5) `, opacity: 0 },
					{ transform: `${translate} rotate(-80deg) scale(2) `, opacity: 1 },
					{ transform: `${translate} rotate(-160deg) scale(0.5) `, opacity: 0 },
				],
				{
					duration: randomIntRange(4, 9) * 100,
					easing: 'ease-in-out',
				}
			)
		}
	})
</script>

<path
	bind:this={element}
	d="M25,0c0,20 5,25 25,25c-20,0 -25,5 -25,25c0,-20 -5,-25 -25,-25c20,0 25,-5 25,-25Z"
	fill="#fff"
/>

<style>
	path {
		transform-origin: 25px 25px;
		opacity: 0;
		will-change: transform, opacity;
	}
</style>
