<script lang="ts">
	export let type: 'engine' | 'car' = 'car'
	export let color: string
	export let symbol: 'heart' | 'star'

	const symbolPaths = {
		engine: {
			heart:
				'M118.153,154.402c9.307,-28.274 27.921,-28.274 37.228,-19.865c9.308,8.408 9.308,25.226 0,42.044c-6.515,12.614 -23.267,25.227 -37.228,33.636c-13.96,-8.409 -30.713,-21.022 -37.228,-33.636c-9.307,-16.818 -9.307,-33.636 -0,-42.044c9.307,-8.409 27.921,-8.409 37.228,19.865Z',
			star: 'M118.153,122.88l10.887,33.505l35.228,-0l-28.5,20.707l10.886,33.504l-28.501,-20.707l-28.5,20.707l10.886,-33.504l-28.501,-20.707l35.229,-0l10.886,-33.505Z',
		},
		car: {
			heart:
				'M187.5,98.87c14.441,-43.87 43.322,-43.87 57.762,-30.823c14.442,13.047 14.442,39.142 0,65.236c-10.108,19.57 -36.101,39.141 -57.762,52.188c-21.661,-13.047 -47.654,-32.618 -57.762,-52.188c-14.441,-26.094 -14.441,-52.189 -0,-65.236c14.44,-13.047 43.321,-13.047 57.762,30.823Z',
			star: 'M187.5,50l16.839,51.824l54.49,-0l-44.084,32.029l16.839,51.823l-44.084,-32.029l-44.084,32.029l16.839,-51.823l-44.084,-32.029l54.49,-0l16.839,-51.824Z',
		},
	}

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
			d="M249.451,100.323l0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M199.406,100.323l-0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M126.21,112.5l16.83,-58.505l0,-41.495l-49.774,0l0,41.495l16.83,58.505l16.114,0Z"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
		/>
		<path
			d="M93.266,12.5l49.774,0"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M286.933,137.5l-0,100l125,0l-0,-100l-125,0Zm125,100l25,0"
			style="fill:var(--train-base-color);stroke:var(--train-base-color);"
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
		<path d={symbolPaths[type][symbol]} style="fill:{color};stroke:{color};" />
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
		<path d={symbolPaths[type][symbol]} style="fill:{color};stroke:{color};" />
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
