<script lang="ts">
	import { carHop } from '../../lib/animations'
	import { getGemColors } from '../../lib/colors'
	import { GRADIENTS, SPARKLE_COORDS } from '../../lib/constants'
	import Sparkle from './Sparkle.svelte'

	export let reverse: boolean
	export let color: string

	$: gemColors = getGemColors(color || '#ff538f')

	$: gemTopLeftColor = reverse ? gemColors.brighterColor : gemColors.brightestColor
	$: gemTopRightColor = reverse ? gemColors.brightestColor : gemColors.brighterColor
	$: gemBottomLeftColor = reverse ? gemColors.darkestColor : gemColors.darkerColor
	$: gemBottomRightColor = reverse ? gemColors.darkerColor : gemColors.darkestColor

	let svgElement: SVGElement

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
	}
</script>

<svg viewBox="0 0 500 367" width="100" height="73" bind:this={svgElement}>
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
			id="Chassis"
			d="M61.9,134.021l0,145.043l400.016,-0l0,-175l-162.489,-0l-0,29.957l-237.527,-0Zm400.016,145.043l25,-0"
			style="fill:url(#LG_Chassis);stroke:url(#LG_Chassis);"
		/>
		<path
			id="Cabin"
			d="M486.916,12.5l-212.518,0l25,0l0,97m162.518,0l0,-97"
			style="fill:none;stroke:url(#LG_Chassis);"
		/>
		<path
			id="Grill"
			d="M62.5,279.064l-50,50l50,-0l0,-25l25,-25l-25,-0Z"
			style="fill:url(#LG_Chassis);stroke:url(#LG_Chassis);"
		/>
		<foreignObject id="Small-Wheel-Rear" x="149.4" y="291.5" width="75" height="75">
			<div class="gold-wheel" />
		</foreignObject>
		<foreignObject id="Small-Wheel-Front" x="74.5" y="291.5" width="75" height="75">
			<div class="gold-wheel" />
		</foreignObject>
		<foreignObject id="Big-Wheel-Rear" x="349.4" y="241.5" width="125" height="125">
			<div class="gold-wheel" />
		</foreignObject>
		<foreignObject id="Big-Wheel-Front" x="224.4" y="241.5" width="125" height="125">
			<div class="gold-wheel" />
		</foreignObject>
		<path
			id="Big-Gem-Top-Left"
			d="M380.772,116.421l-0,25l-37.32,37.319l-25.145,0.181l62.465,-62.5Z"
			style="fill:{gemTopLeftColor};"
		/>
		<path
			id="Big-Gem-Bottom-Left"
			d="M318.307,178.921l25.145,-0.181l37.32,37.681l-0,24.883l-62.465,-62.383Z"
			style="fill:{gemBottomLeftColor};"
		/>
		<path
			id="Big-Gem-Bottom-Right"
			d="M380.772,216.421l37.639,-37.639l24.826,0.139l-62.465,62.383l-0,-24.883Z"
			style="fill:{gemBottomRightColor};"
		/>
		<path
			id="Big-Gem-Top-Right"
			d="M380.772,141.421l37.639,37.361l24.826,0.139l-62.465,-62.5l-0,25Z"
			style="fill:{gemTopRightColor};"
		/>
		<path
			id="Big-Gem-Center"
			d="M418.411,178.782l-37.639,37.639l-37.31,-37.681l37.31,-37.319l37.639,37.361Z"
			style="fill:{gemColors.baseColor};"
		/>
		<path
			id="Rear-Gem-Top-Left"
			d="M220.904,141.421l-0,14.991l-22.378,22.377l-15.078,0.108l37.456,-37.476Z"
			style="fill:{gemTopLeftColor};"
		/>
		<path
			id="Front-Gem-Top-Left"
			d="M112.232,141.421l0,14.991l-22.377,22.377l-15.078,0.108l37.455,-37.476Z"
			style="fill:{gemTopLeftColor};"
		/>
		<path
			id="Rear-Gem-Bottom-Left"
			d="M183.448,178.897l15.078,-0.108l22.378,22.594l-0,14.921l-37.456,-37.407Z"
			style="fill:{gemBottomLeftColor};"
		/>
		<path
			id="Front-Gem-Bottom-Left"
			d="M74.777,178.897l15.078,-0.108l22.377,22.594l0,14.921l-37.455,-37.407Z"
			style="fill:{gemBottomLeftColor};"
		/>
		<path
			id="Rear-Gem-Bottom-Right"
			d="M220.904,201.383l22.569,-22.569l14.886,0.083l-37.455,37.407l-0,-14.921Z"
			style="fill:{gemBottomRightColor};"
		/>
		<path
			id="Front-Gem-Bottom-Right"
			d="M112.232,201.383l22.569,-22.569l14.887,0.083l-37.456,37.407l0,-14.921Z"
			style="fill:{gemBottomRightColor};"
		/>
		<path
			id="Rear-Gem-Top-Right"
			d="M220.904,156.412l22.569,22.402l14.886,0.083l-37.455,-37.476l-0,14.991Z"
			style="fill:{gemTopRightColor};"
		/>
		<path
			id="Front-Gem-Top-Right"
			d="M112.232,156.412l22.569,22.402l14.887,0.083l-37.456,-37.476l0,14.991Z"
			style="fill:{gemTopRightColor};"
		/>
		<path
			id="Rear-Gem-Center"
			d="M243.473,178.814l-22.569,22.569l-22.372,-22.594l22.372,-22.377l22.569,22.402Z"
			style="fill:{gemColors.baseColor};"
		/>
		<path
			id="Front-Gem-Center"
			d="M134.801,178.814l-22.569,22.569l-22.372,-22.594l22.372,-22.377l22.569,22.402Z"
			style="fill:{gemColors.baseColor};"
		/>
		<Sparkle coords={SPARKLE_COORDS.engine} {reverse} />
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
			id="LG_Chassis"
			x2="1"
			y2="0"
			gradientUnits="userSpaceOnUse"
			gradientTransform="matrix(0,338,-225,0,450,-47)"
		>
			{@html GRADIENTS.gold}
		</linearGradient>
	</defs>
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
	.gold-wheel {
		width: 100%;
		height: 100%;
		background-image: conic-gradient(
			from 140deg,
			#eace50 0%,
			#be9c38 28%,
			#fef9b5 48%,
			#eace50 67%,
			#be9c38 85%,
			#eace50 100%
		);
		border-radius: 50%;
	}
	.reverse .gold-wheel {
		background-image: conic-gradient(
			from 140deg,
			#eace50 0%,
			#be9c38 28%,
			#eace50 48%,
			#fef9b5 67%,
			#be9c38 85%,
			#eace50 100%
		);
	}
</style>
