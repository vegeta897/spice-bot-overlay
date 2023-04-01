<script lang="ts">
	// import { randomIntRange } from '../lib/util'

	export let type: 'engine' | 'car' = 'car'
	export let color: string

	// const bumpAnimDuration = randomIntRange(150, 250) * 10
	// const bumpAnimDelay = randomIntRange(1, 200) * 10

	export function hop(delay: number, force: number) {
		const height = Math.round(force * 20)
		const halfHeight = Math.round(force * 10)
		const tilt = Math.round(force * 10)
		svgElement.animate(
			[
				{ transform: 'translateY(0) rotate(0)', easing: 'linear' },
				{
					transform: `translateY(-${halfHeight}px) rotate(-${tilt}deg)`,
					easing: 'ease-out',
				},
				{ transform: `translateY(-${height}px) rotate(0)`, easing: 'ease-in' },
				{
					transform: `translateY(-${halfHeight}px) rotate(${tilt}deg)`,
					easing: 'linear',
				},
				{ transform: 'translateY(0) rotate(0)' },
			],
			{ delay, duration: 200 + force * 200 }
		)
	}

	let svgElement: SVGElement
</script>

{#if type === 'engine'}
	<svg viewBox="0 0 450 325" width="90" height="65" bind:this={svgElement}>
		<path
			d="M86.933,287.5l-0,-50l325,0l-0,25l-100,0l-75,25l-150,0Z"
			style="fill:var(--train-pop-color);stroke:var(--train-pop-color);"
		/>
		<path
			d="M299.518,112.5l100.211,0"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M436.933,12.5l-175,0l25,0l-0,125l125,0l-0,-125"
			style="fill:none;stroke:var(--train-base-color);"
		/>
		<path
			d="M61.933,115.5c-31.865,20.125 -31.776,91.006 -0,110"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<rect
			x="61.933"
			y="112.5"
			width="225"
			height="125"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M126.21,112.5l16.83,-58.505l0,-41.495l-49.774,0l0,41.495l16.83,58.505l16.114,0Z"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M286.933,137.5l-0,100l125,0l-0,-100l-125,0Zm125,100l25,0"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<rect
			x="49.438"
			y="124.934"
			width="374.98"
			height="89.345"
			style="fill:{color}cc"
		/>
		<path
			d="M249.451,100.323l0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M199.406,100.323l-0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M93.266,12.5l49.774,0"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<circle
			cx="111.933"
			cy="287.5"
			r="25"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<circle
			cx="186.933"
			cy="287.5"
			r="25"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<circle
			cx="336.933"
			cy="262.5"
			r="50"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<path
			d="M62.5,237.5l-50,50l50,0l0,-25l25,-25l-25,0Z"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
	</svg>
{:else}
	<svg viewBox="0 0 375 300" width="75" height="60" bind:this={svgElement}>
		<circle
			cx="87.5"
			cy="262.5"
			r="25"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<circle
			cx="287.5"
			cy="262.5"
			r="25"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<!-- <g
			class="train-car-non-wheels"
			style="animation-duration: {bumpAnimDuration}ms; animation-delay: {bumpAnimDelay}ms"
		> -->
		<rect
			x="162.5"
			y="12.5"
			width="50"
			height="25"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<rect
			x="37.5"
			y="212.5"
			width="300"
			height="25"
			style="fill:var(--train-pop-color);stroke:var(--train-pop-color);"
		/>
		<path
			d="M37.5,212.5l-25,-175l350,0l-25,175l-300,0Z"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M12.5,212.5l350,0"
			style="fill:none;stroke:var(--train-base-color);"
		/>
		<path
			d="M366.143,99.934l-357.286,0l8.144,56.945l340.998,0l8.144,-56.945Z"
			style="fill:{color}cc"
		/>
		<!-- </g> -->
	</svg>
{/if}

<style>
	svg {
		display: inline-block;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 25px;
		margin: 0 4px;
	}

	/* .train-car-non-wheels {
		animation-timing-function: linear;
		animation-name: bump;
		animation-iteration-count: infinite;
	}

	@keyframes bump {
		0%,
		10% {
			transform: translateY(0);
		}
		5% {
			transform: translateY(18px);
		}
	} */
</style>
