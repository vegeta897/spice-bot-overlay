<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { randomIntRange } from '../../lib/util'
	import { COLORS, TRAIN } from '../../lib/constants'

	export let reverse = false
	export let speed: number // Pixels per ms
	export let disable: boolean

	const baseCloudDuration = 3000
	const baseCloudRate = 200
	const cloudCount = Math.ceil(baseCloudDuration / baseCloudRate)

	$: speedRatio = TRAIN.speed / (speed * 1000)
	$: cloudDuration = baseCloudDuration * speedRatio
	$: cloudRate = baseCloudRate * speedRatio

	const clouds: SVGElement[] = []

	onMount(() => {
		for (let i = 0; i < cloudCount; i++) {
			const newCloud = cloudElement.cloneNode(true) as SVGElement
			const fill = `${COLORS.smokeyRainbow[i % COLORS.smokeyRainbow.length]}bb`
			newCloud.children[0].setAttribute('fill', fill)
			clouds.push(newCloud)
			containerElement.appendChild(newCloud)
		}
		animateSmoke()
	})
	onDestroy(() => clearTimeout(timeout))

	let timeout: number

	function animateSmoke() {
		for (let i = 0; i < clouds.length; i++) {
			animateCloud(clouds[i], i * cloudRate)
		}
		timeout = setTimeout(animateSmoke, cloudDuration)
	}

	let containerElement: HTMLDivElement

	const newCloudPlaceholder = document.createElement('div')
	newCloudPlaceholder.innerHTML = `<svg	width="20px" height="20px" viewBox="0 0 20 20"
    style="opacity: 0; transform-origin: 10px 10px; position: absolute; filter: blur(4px); will-change: transform, opacity;">
		<circle cx="10" cy="10" r="10" /></svg>`
	const cloudElement = newCloudPlaceholder.firstElementChild!

	function animateCloud(cloud: SVGElement, delay: number) {
		if (!cloud) return
		const fromScale = randomIntRange(5, 20) / 10
		const toScale = (randomIntRange(30, 50) / 10) * Math.min(1, speedRatio * 4)
		const toScaleX = Math.max(toScale, Math.round(toScale * (0.8 / speedRatio)))
		const toX = Math.round(speed * cloudDuration + randomIntRange(-50, 50))
		const toXBegin = Math.round(toX / 10)
		const toY = (-180 + randomIntRange(-20, 20)) * speedRatio
		const toYBegin = Math.round(toY / 5)
		cloud.animate(
			[
				{
					opacity: 0,
					transform: `translate(0,0) scale(${fromScale})`,
					easing: 'cubic-bezier(0, 0, 0.325, 0.675)',
				},
				{
					opacity: 1,
					transform: `translate(${toXBegin}px, ${toYBegin}px) scale(${toScale / 2})`,
					offset: 0.1,
				},
				{
					opacity: 0,
					transform: `translate(${toX}px, ${toY}px) scale(${toScaleX},${toScale})`,
				},
			],
			{
				duration: cloudDuration,
				delay: delay + randomIntRange(0, 10) * 10,
				fill: 'forwards',
			}
		)
	}
</script>

<div
	class="cloud-container"
	class:reverse
	style:display={disable ? 'none' : 'block'}
	bind:this={containerElement}
/>

<style>
	.cloud-container {
		position: absolute;
		left: 12px;
		top: -18px;
	}
	.cloud-container.reverse {
		left: auto;
		right: 16px;
		transform: scaleX(-1);
	}
</style>
