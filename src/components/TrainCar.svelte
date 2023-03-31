<script lang="ts">
	export let type: 'engine' | 'car' = 'car'
	export let color: string
	export let symbol: 'heart' | 'star'

	const symbolPaths = {
		heart:
			'M187.5,98.87c14.441,-43.87 43.322,-43.87 57.762,-30.823c14.442,13.047 14.442,39.142 0,65.236c-10.108,19.57 -36.101,39.141 -57.762,52.188c-21.661,-13.047 -47.654,-32.618 -57.762,-52.188c-14.441,-26.094 -14.441,-52.189 -0,-65.236c14.44,-13.047 43.321,-13.047 57.762,30.823Z',
		star: 'M187.5,50l16.839,51.824l54.49,-0l-44.084,32.029l16.839,51.823l-44.084,-32.029l-44.084,32.029l16.839,-51.823l-44.084,-32.029l54.49,-0l16.839,-51.824Z',
	}

	// Draw with path data, and give each vertex random XY variation seeded by user ID
	// Or just variable width, height, skew, wheel size, wheel spacing, etc

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
	<svg viewBox="0 0 400 325" width="80" height="65" bind:this={svgElement}>
		<path
			d="M62.5,287.5l0,-50l300,0l0,25l-62.5,0l-87.5,25l-150,0Z"
			style="fill:var(--train-pop-color);stroke:var(--train-pop-color);"
		/>
		<path
			d="M250.086,112.5l100.211,0"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M387.5,12.5l-175,0l25,0l0,125l125,0l0,-125"
			style="fill:none;stroke:var(--train-base-color);"
		/>
		<path
			d="M62.5,115.5c-31.864,20.125 -31.776,91.006 0,110"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<rect
			x="62.5"
			y="112.5"
			width="175"
			height="125"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M199.5,100.323l0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M162.5,100.323l0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M112.5,112.5l12.442,-50l-0,-50l-62.442,0l-0,50l12.442,50l37.558,0Z"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M237.5,137.5l0,100l125,0l0,-100l-125,0Zm125,100l25,0"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<circle
			cx="112.5"
			cy="287.5"
			r="25"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<circle
			cx="187.5"
			cy="287.5"
			r="25"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<circle
			cx="300"
			cy="275"
			r="37.5"
			style="fill:var(--train-base-color);stroke:var(--train-pop-color);"
		/>
		<path
			d="M62.5,237.5l-50,50l50,0l0,-25l25,-25l-25,0Z"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M62.5,12.5l62.442,0"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
	</svg>
{:else}
	<svg viewBox="0 0 375 300" width="75" height="60" bind:this={svgElement}>
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
		<path
			d="M37.5,212.5l-25,-175l350,0l-25,175l-300,0Z"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M12.5,212.5l350,0"
			style="fill:none;stroke:var(--train-base-color);"
		/>
		<path d={symbolPaths[symbol]} style="fill:{color};stroke:{color};" />
	</svg>
{/if}

<style>
	svg {
		display: inline-block;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 25px;
		margin: 0 2.5px;
		/* background-color: rgba(255, 255, 255, 0.1); */
	}
</style>
