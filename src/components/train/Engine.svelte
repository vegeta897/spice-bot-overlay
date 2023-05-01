<script lang="ts">
	import { carHop } from '../../lib/animations'

	export let reverse: boolean
	export let color: string

	$: _color = color ? `${color}cc` : 'var(--train-pop-color)'

	let svgElement: SVGElement

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
	}
</script>

<svg viewBox="0 0 450 325" width="90" height="65" bind:this={svgElement}>
	<g class:reverse>
		<path
			d="M86.933,287.5l-0,-50l325,0l-0,25l-100,0l-75,25l-150,0Z"
			style="fill:var(--train-pop-color);stroke:var(--train-pop-color);"
		/>
		<path d="M299.518,112.5l100.211,0" style="fill:none;stroke:var(--train-pop-color);" />
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
		<rect x="49.438" y="124.934" width="374.98" height="89.345" style="fill:{_color}" />
		<path
			d="M249.451,100.323l0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path
			d="M199.406,100.323l-0,62.177"
			style="fill:none;stroke:var(--train-pop-color);"
		/>
		<path d="M93.266,12.5l49.774,0" style="fill:none;stroke:var(--train-pop-color);" />
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
	</g>
</svg>

<style>
	svg {
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 25px;
		will-change: transform;
	}
	g.reverse {
		transform: scaleX(-1);
		transform-origin: center;
	}
</style>
