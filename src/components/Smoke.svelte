<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { TRAIN } from '../lib/constants'
	import { randomIntRange } from '../lib/util'

	const clouds: SVGElement[] = []
	const cloudDuration = 3000
	const cloudRate = 200
	const cloudCount = Math.ceil(cloudDuration / cloudRate)

	let containerElement: HTMLDivElement
	let interval: number
	let nextCloudIndex = 0

	const smokyRainbow = [
		'#D6A4A9',
		'#CEABB4',
		'#C2B8C3',
		'#BAC3C3',
		'#B5CDB4',
		'#ADD3B3',
		'#A0CFC8',
		'#9CCAD6',
		'#ADC3D0',
		'#BDBCCA',
		'#C8B1BC',
	]

	const newCloudPlaceholder = document.createElement('div')
	newCloudPlaceholder.innerHTML = `<svg	width="20px" height="20px" viewBox="0 0 20 20"
    style="opacity: 0; transform-origin: 10px 10px; position: absolute; filter: blur(4px);">
		<circle cx="10" cy="10" r="10" /></svg>`
	const cloudElement = newCloudPlaceholder.firstElementChild

	onMount(() => {
		for (let i = 0; i < cloudCount; i++) {
			const newCloud = cloudElement.cloneNode(true) as SVGElement
			const fill = `${smokyRainbow[i % smokyRainbow.length]}bb`
			newCloud.children[0].setAttribute('fill', fill)
			clouds.push(newCloud)
			containerElement.appendChild(newCloud)
		}
		interval = setInterval(animateCloud, cloudRate)
	})

	function animateCloud() {
		const cloud = clouds[nextCloudIndex]
		nextCloudIndex = (nextCloudIndex + 1) % cloudCount
		const fromScale = randomIntRange(5, 20) / 10
		const toScale = randomIntRange(30, 50) / 10
		const toX = Math.round(
			TRAIN.speed * (cloudDuration / 1000) + randomIntRange(-50, 50)
		)
		const toY = -180 + randomIntRange(-20, 20)
		cloud.animate(
			[
				{
					opacity: 0,
					transform: `translate(0,0) scale(${fromScale})`,
					easing: 'cubic-bezier(0, 0, 0.325, 0.675)',
				},
				{
					opacity: 1,
					transform: `translate(40px, -40px) scale(${toScale / 2})`,
					offset: 0.1,
					easing: 'linear',
				},
				{
					opacity: 0,
					transform: `translate(${toX}px, ${toY}px) scale(${toScale})`,
				},
			],
			{
				duration: cloudDuration,
				delay: randomIntRange(0, 10) * 10,
				fill: 'forwards',
			}
		)
	}

	onDestroy(() => clearInterval(interval))
</script>

<div class="cloud-container" bind:this={containerElement} />

<style>
	.cloud-container {
		position: absolute;
		left: 20px;
		top: -6px;
	}
</style>
