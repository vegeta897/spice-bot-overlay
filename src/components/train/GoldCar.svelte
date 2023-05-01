<script lang="ts">
	import { carHop } from '../../lib/animations'
	import { GRADIENTS, SPARKLE_COORDS } from '../../lib/constants'
	import CoinStacks from './CoinStacks.svelte'
	import Sparkle from './Sparkle.svelte'
	import { getGemColors } from '../../lib/colors'

	export let reverse: boolean
	export let color: string
	export let type: 'bits' | 'subs'
	export let amount: number

	$: gemColors = getGemColors(color || '#ff538f')

	$: gemTopLeftColor = gemColors.brightestColor
	$: gemTopRightColor = gemColors.brighterColor
	$: gemBottomLeftColor = gemColors.darkerColor
	$: gemBottomRightColor = gemColors.darkestColor

	let svgElement: SVGElement
	let coinStacksComponent: CoinStacks

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
		if (delay > 0) setTimeout(() => coinStacksComponent.jostle(force), delay)
		else coinStacksComponent.jostle(force)
	}
</script>

<CoinStacks bind:this={coinStacksComponent} {amount} {reverse} />
<svg viewBox="0 0 425 276" width="85" height="55" bind:this={svgElement}>
	<rect
		id="Underside"
		x="37.5"
		y="187.5"
		width="350"
		height="25"
		style="fill:none;stroke:#d4b544;"
	/>
	<foreignObject id="Front-Wheel" x="50" y="200" width="75" height="75">
		<div class="gold-wheel" />
	</foreignObject>
	<foreignObject id="Rear-Wheel" x="298" y="200" width="75" height="75">
		<div class="gold-wheel" />
	</foreignObject>
	<path
		id="Body"
		d="M37.5,187.5l-25,-175l399.984,0l-25,175l-349.984,0Z"
		style="fill:url(#LG-Body);stroke:url(#LG-Body);"
	/>
	<path id="Rim" d="M12.5,187.5l400,0" style="fill:none;stroke:#e9cd50;" />
	<path
		id="Big-Gem-Top-Left"
		d="M212.493,24.857l-0,25l-37.32,37.32l-25.145,0.18l62.465,-62.5Z"
		style="fill:{gemTopLeftColor};"
	/>
	<path
		id="Big-Gem-Bottom-Left"
		d="M150.028,87.357l25.145,-0.18l37.32,37.68l-0,24.883l-62.465,-62.383Z"
		style="fill:{gemBottomLeftColor};"
	/>
	<path
		id="Big-Gem-Bottom-Right"
		d="M212.493,124.857l37.638,-37.638l24.826,0.138l-62.464,62.383l-0,-24.883Z"
		style="fill:{gemBottomRightColor};"
	/>
	<path
		id="Big-Gem-Top-Right"
		d="M212.493,49.857l37.638,37.362l24.826,0.138l-62.464,-62.5l-0,25Z"
		style="fill:{gemTopRightColor};"
	/>
	<path
		id="Big-Gem-Center"
		d="M250.131,87.219l-37.638,37.638l-37.311,-37.68l37.311,-37.32l37.638,37.362Z"
		style="fill:{gemColors.baseColor};"
	/>
	<path
		id="Rear-Gem-Top-Left"
		d="M335.478,49.857l-0,14.991l-22.378,22.377l-15.078,0.109l37.456,-37.477Z"
		style="fill:{gemTopLeftColor};"
	/>
	<path
		id="Front-Gem-Top-Left"
		d="M87.445,49.857l0,14.991l-22.378,22.377l-15.077,0.109l37.455,-37.477Z"
		style="fill:{gemTopLeftColor};"
	/>
	<path
		id="Rear-Gem-Bottom-Left"
		d="M298.022,87.334l15.078,-0.109l22.378,22.595l-0,14.92l-37.456,-37.406Z"
		style="fill:{gemBottomLeftColor};"
	/>
	<path
		id="Front-Gem-Bottom-Left"
		d="M49.99,87.334l15.077,-0.109l22.378,22.595l0,14.92l-37.455,-37.406Z"
		style="fill:{gemBottomLeftColor};"
	/>
	<path
		id="Rear-Gem-Bottom-Right"
		d="M335.478,109.82l22.569,-22.569l14.886,0.083l-37.455,37.406l-0,-14.92Z"
		style="fill:{gemBottomRightColor};"
	/>
	<path
		id="Front-Gem-Bottom-Right"
		d="M87.445,109.82l22.569,-22.569l14.886,0.083l-37.455,37.406l0,-14.92Z"
		style="fill:{gemBottomRightColor};"
	/>
	<path
		id="Rear-Gem-Top-Right"
		d="M335.478,64.848l22.569,22.403l14.886,0.083l-37.455,-37.477l-0,14.991Z"
		style="fill:{gemTopRightColor};"
	/>
	<path
		id="Front-Gem-Top-Right"
		d="M87.445,64.848l22.569,22.403l14.886,0.083l-37.455,-37.477l0,14.991Z"
		style="fill:{gemTopRightColor};"
	/>
	<path
		id="Rear-Gem-Center"
		d="M358.047,87.251l-22.569,22.569l-22.372,-22.595l22.372,-22.377l22.569,22.403Z"
		style="fill:{gemColors.baseColor};"
	/>
	<path
		id="Front-Gem-Center"
		d="M110.014,87.251l-22.569,22.569l-22.372,-22.595l22.372,-22.377l22.569,22.403Z"
		style="fill:{gemColors.baseColor};"
	/>
	<Sparkle coords={SPARKLE_COORDS.car} />
	<defs>
		<linearGradient
			id="LG-Body"
			x1="0"
			y1="0"
			x2="1"
			y2="0"
			gradientUnits="userSpaceOnUse"
			gradientTransform="matrix(424,0,0,212,1,12.5)"
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
</style>
