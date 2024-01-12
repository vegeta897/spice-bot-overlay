<script lang="ts">
	import { ContainerSvg } from 'grace-train-lib/components'
	import { carHop } from '../../lib/animations'
	import { GRADIENTS, TRAIN } from '../../lib/constants'

	export let reverse: boolean

	let svgElement: SVGElement

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
	}
</script>

<ContainerSvg viewBox="0 0 500 367" width="{TRAIN.engineWidthGold}px" bind:svgElement>
	<g class:reverse>
		<path
			id="Underside"
			d="M86.9,329.064l0,-50l375.016,-0l0,25l-100,-0l-75,25l-200.016,-0Z"
			style="fill:url(#LG-Underside);stroke:url(#LG-Underside);"
		/>
		<path
			id="Dome"
			d="M61.916,137.021c-31.864,23.785 -31.776,107.552 0,130"
			style="fill:none;stroke:url(#RG-Dome);"
		/>
		<path
			id="Chimney"
			d="M122.622,134.021l20.452,-71.096l-0,-50.425l-60.486,-0l0,50.425l20.452,71.096l19.582,-0Z"
			style="fill:url(#LG-Chimney);stroke:url(#LG-Chimney);"
		/>
		<path
			id="Body"
			d="M61.9,134.021l0,145.043l237.52,-0l0.007,-145.043l-237.527,-0Z"
			style="fill:url(#LG_Body);stroke:url(#LG_Body);"
		/>
		<path
			id="Rear-Bracer"
			d="M249.708,121.709l0,62.2"
			style="fill:none;stroke:#ff538f;"
		/>
		<path
			id="Front-Bracer"
			d="M199.723,121.709l-0,62.2"
			style="fill:none;stroke:#ff538f;"
		/>
		<path
			id="Cabin-Box"
			d="M299.427,279.064l162.489,-0l0,-175l-162.489,-0l-0,175Zm162.489,-0l25,-0"
			style="fill:url(#LG_Cabin);stroke:url(#LG_Cabin);"
		/>
		<path id="Cabin-Liner" d="M299.4,104.1l162.5,-0" style="fill:none;stroke:#ff538f;" />
		<path
			id="Cabin"
			d="M486.916,12.5l-212.518,0l25,0l0,97m162.518,0l0,-97"
			style="fill:none;stroke:url(#LG_Cabin);"
		/>
		<path
			id="Grill"
			d="M62.5,279.064l-50,50l50,-0l0,-25l25,-25l-25,-0Z"
			style="fill:url(#LG_Body);stroke:url(#LG_Body);"
		/>
		<g class:reverse style:transform-origin="149.5px">
			<foreignObject id="Small-Wheel-Rear" x="149.4" y="291.5" width="75" height="75">
				<div class="gold-wheel" />
			</foreignObject>
			<foreignObject id="Small-Wheel-Front" x="74.5" y="291.5" width="75" height="75">
				<div class="gold-wheel" />
			</foreignObject>
		</g>
		<g class:reverse style:transform-origin="349.4px">
			<foreignObject id="Big-Wheel-Rear" x="349.4" y="241.5" width="125" height="125">
				<div class="gold-wheel" />
			</foreignObject>
			<foreignObject id="Big-Wheel-Front" x="224.4" y="241.5" width="125" height="125">
				<div class="gold-wheel" />
			</foreignObject>
		</g>
	</g>
	<defs>
		<linearGradient
			id="LG-Underside"
			x2="1"
			y2="0"
			gradientUnits="userSpaceOnUse"
			gradientTransform="matrix(449,0,0,69,12.5,304)"
		>
			{@html GRADIENTS.gold}
		</linearGradient>
		<radialGradient
			id="RG-Dome"
			cx="0"
			cy="0"
			r="1"
			gradientUnits="userSpaceOnUse"
			gradientTransform="matrix(0,236,-200,0,31,142)"
		>
			{@html GRADIENTS.gold}
		</radialGradient>
		<linearGradient
			id="LG-Chimney"
			x2="1"
			y2="0"
			gradientUnits="userSpaceOnUse"
			gradientTransform="matrix({reverse ? '152,0,0,305,30,73' : '-152,0,0,-305,181,73'})"
		>
			{@html GRADIENTS.gold}
		</linearGradient>
		<linearGradient
			id="LG_Body"
			x2="1"
			y2="0"
			gradientUnits="userSpaceOnUse"
			gradientTransform="matrix(0,338,-225,0,450,-47)"
		>
			{@html GRADIENTS.gold}
		</linearGradient>
		<linearGradient
			id="LG_Cabin"
			x2="1"
			y2="0"
			gradientUnits="userSpaceOnUse"
			gradientTransform="matrix(409,509,-339,273,78,-230)"
		>
			{@html GRADIENTS.gold}
		</linearGradient>
	</defs>
</ContainerSvg>

<style>
	g.reverse {
		transform: scaleX(-1);
		transform-origin: center;
	}
	.gold-wheel {
		width: 100%;
		height: 100%;
		background-image: conic-gradient(
			from 140deg,
			#f8d740 0%,
			#cda42a 28%,
			#fffab1 48%,
			#f8d740 67%,
			#cda42a 85%,
			#f8d740 100%
		);
		border-radius: 50%;
	}
</style>
