<script lang="ts">
	import { carHop } from '../../lib/animations'

	export let reverse: boolean
	export let color: string | null

	$: _color = color ? `${color}cc` : 'var(--train-pop-color)'

	let svgElement: SVGElement

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
	}
</script>

<!-- TODO: Increase size when depot site launches -->
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
	<path d="M12.5,212.5l350,0" style="fill:none;stroke:var(--train-base-color);" />
	<path
		d="M366.143,99.934l-357.286,0l8.144,56.945l340.998,0l8.144,-56.945Z"
		style="fill:{_color}"
	/>
	<!-- <foreignObject width="375" height="325" y="-25">
		<div
			class="nunito"
			style:transform-origin="0 0"
			style:font-size="175px"
			style:line-height="175px"
			style:transform="scale(0.65,1.52)"
			style:color={_color.substring(0, 7)}
		>
			WHAT
		</div>
	</foreignObject> -->
</svg>

<style>
	svg {
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 25px;
	}
</style>
