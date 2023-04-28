<script lang="ts" context="module">
	const gravity = 300
	const upDurations: number[] = []
	const downDurations: number[] = []
	const minUpForce = 5
	const maxUpForce = 30

	// Pre-compute durations because these are expensive calculations
	for (let i = minUpForce; i <= maxUpForce; i++) {
		upDurations[i] = Math.round(Math.sqrt((i * 10) / gravity) * 1000)
		downDurations[i] = Math.round(Math.sqrt((i * 10 + 100) / gravity) * 1000)
	}

	const easeIn = 'cubic-bezier(0.12, 0, 0.39, 0)'
	const easeOut = 'cubic-bezier(0.61, 1, 0.88, 1)'
	const easeInCirc = 'cubic-bezier(0.33, 0, 0.67, 0.33)'
	const easeOutCirc = 'cubic-bezier(0.33, 0.67, 0.67, 1)'
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import { randomIntRange } from '../../lib/util'

	export let size = 30
	export let spinny = false // Makes the coin more spinnier

	let translateXdiv: HTMLDivElement
	let translateYdiv: HTMLDivElement
	let svgElement: SVGElement
	let frontGroupElement: SVGGElement
	let shineCircleElement: SVGCircleElement
	let circleBackElement: SVGCircleElement
	let rectElement: SVGRectElement

	const spinDuration = randomIntRange(100, spinny ? 400 : 1500)
	const degreesPerSecond = randomIntRange(-300, 300)
	const rotateTo = degreesPerSecond < 0 ? '-360deg' : '360deg'
	const rotateDuration = Math.abs(Math.round((360 / degreesPerSecond) * 1000))

	onMount(() => {
		svgElement.animate(
			[{ transform: 'rotate(0)' }, { transform: `rotate(${rotateTo})` }],
			{ duration: rotateDuration, iterations: Infinity }
		)
		frontGroupElement.animate(
			[
				{ transform: 'translateX(4px) scaleX(0)', easing: easeOut },
				{ transform: 'translateX(0) scaleX(1)', easing: easeIn },
				{ transform: 'translateX(-4px) scaleX(0)' },
			],
			{ duration: spinDuration, iterations: Infinity }
		)
		shineCircleElement.animate(
			[{ opacity: 0.5, easing: easeOut }, { opacity: 0, easing: easeIn }, { opacity: 1 }],
			{ duration: spinDuration, iterations: Infinity }
		)
		circleBackElement.animate(
			[
				{ transform: 'translateX(-4px) scaleX(0)', easing: easeOut },
				{ transform: 'translateX(0) scaleX(1)', easing: easeIn },
				{ transform: 'translateX(4px) scaleX(0)' },
			],
			{ duration: spinDuration, iterations: Infinity }
		)
		rectElement.animate(
			[
				{ transform: 'scaleX(1)', easing: easeOut },
				{ transform: 'scaleX(0)', easing: easeIn },
				{ transform: 'scaleX(1)' },
			],
			{ duration: spinDuration, iterations: Infinity }
		)
	})

	export function toss(trainSpeed: number, baseDuration: number, yScale = 1, delay = 0) {
		const xDelta = randomIntRange(-50, 50) / 1000
		const upForce = randomIntRange(minUpForce, maxUpForce)
		const toX = (trainSpeed + xDelta) * 1000 * (baseDuration / 1000)
		const toY = upForce * -10 * yScale
		const upDuration = upDurations[upForce] * yScale
		const downDuration = downDurations[upForce] * yScale
		const duration = upDuration + downDuration
		const maxDelay = Math.max(0, Math.round((baseDuration - duration) / 8))
		delay = delay + randomIntRange(0, maxDelay)
		translateXdiv.animate(
			[
				{ transform: 'translateX(0) scale(0.3)', opacity: 0 },
				{
					transform: `translateX(${toX / 20}px) scale(1)`,
					opacity: 1,
					offset: 0.05,
				},
				{ transform: `translateX(${toX}px)`, opacity: 1 },
			],
			{ duration, delay, fill: 'forwards' }
		)
		translateYdiv.animate(
			[
				{ transform: 'translateY(0)', easing: easeOutCirc },
				{
					transform: `translateY(${toY}px)`,
					easing: easeInCirc,
					offset: upDuration / duration,
				},
				{ transform: 'translateY(100px)' },
			],
			{ duration, delay, fill: 'forwards' }
		)
	}
</script>

<div class="container will-transform will-opacity" bind:this={translateXdiv}>
	<div class="will-transform" bind:this={translateYdiv}>
		<svg
			class="will-transform"
			bind:this={svgElement}
			viewBox="0 0 30 30"
			width="{size}px"
			height="{size}px"
		>
			<rect
				class="will-transform"
				bind:this={rectElement}
				x="11"
				width="8"
				height="30"
				fill="url(#coin_edge)"
			/>
			<circle
				class="back will-transform"
				bind:this={circleBackElement}
				cx="15"
				cy="15"
				r="15"
				fill="url(#coin_edge)"
			/>
			<g bind:this={frontGroupElement} class="front will-transform">
				<circle fill="url(#coin_face)" cx="15" cy="15" r="15" />
				<circle fill="url(#coin_face_inset)" cx="15" cy="15" r="10" />
				<circle
					class="shine will-opacity"
					bind:this={shineCircleElement}
					cx="15"
					cy="15"
					r="15"
				/>
			</g>
			<defs>
				<linearGradient id="coin_edge" gradientTransform="rotate(90)">
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.3" stop-color="#FFDB4D" />
					<stop offset="0.7" stop-color="#FFDB4D" />
					<stop offset="1" stop-color="#FCC900" />
				</linearGradient>
				<linearGradient id="coin_face">
					<stop offset="0" stop-color="#FFDB4D" />
					<stop offset="1" stop-color="#E1B400" />
				</linearGradient>
				<linearGradient id="coin_face_inset">
					<stop offset="0" stop-color="#E1B400" />
					<stop offset="1" stop-color="#FFDB4D" />
				</linearGradient>
			</defs>
		</svg>
	</div>
</div>

<style>
	.container {
		position: absolute;
		opacity: 0;
	}
	div,
	svg,
	g,
	circle.back,
	rect {
		transform-origin: center;
	}
	.front circle.shine {
		fill: #fffcce;
	}
	.will-transform {
		will-change: transform;
	}
	.will-opacity {
		will-change: opacity;
	}
	.will-transform.will-opacity {
		will-change: transform, opacity;
	}
</style>
