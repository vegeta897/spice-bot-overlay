<script lang="ts">
	import { GRADIENTS, SPARKLE_COORDS } from '../../lib/constants'
	import Color from 'color'
	import { clamp } from '../../lib/util'
	import Sparkle from './Sparkle.svelte'
	import CoinStacks from './CoinStacks.svelte'

	export let type: 'engine' | 'car' = 'car'
	export let color: string | null
	export let reverse = false
	export let gold = false

	$: _color = color ? `${color}cc` : 'var(--train-pop-color)'

	$: colorObject = Color(color || '#ff538f')
	$: baseColor = colorObject.lightness(clamp(colorObject.lightness(), 40, 85)).hex()
	$: brighterColor = colorObject.lightness(75).rotate(10).hex()
	$: brightestColor = colorObject.lightness(92).rotate(20).hex()
	$: darkerColor = colorObject.lightness(55).rotate(-10).hex()
	$: darkestColor = colorObject.lightness(30).rotate(-20).hex()
	$: gemTopLeftColor = reverse ? brighterColor : brightestColor
	$: gemTopRightColor = reverse ? brightestColor : brighterColor
	$: gemBottomLeftColor = reverse ? darkestColor : darkerColor
	$: gemBottomRightColor = reverse ? darkerColor : darkestColor

	let carSVGelement: SVGElement

	let coinStacksComponent: CoinStacks

	// TODO: Round all svg coords to 1 or 2 decimals, 3 is overkill

	const timeScale = 1

	export function hop(delay: number, force: number) {
		const flipX = reverse ? -1 : 1
		const jump = Math.round(force * -20)
		const halfJump = Math.round(jump / 2)
		const shimmy = Math.round(force * -8) * flipX
		const tilt = Math.round(force * 10) * flipX
		const halfTilt = Math.round(tilt / 1.5)
		delay *= timeScale
		carSVGelement.animate(
			[
				{ transform: 'translate(0,0) rotate(0)', easing: 'linear' },
				{
					transform: `translate(${shimmy}px,${halfJump}px) rotate(${tilt * -1}deg)`,
					easing: 'ease-out',
				},
				{
					transform: `translate(0,${jump}px) rotate(0)`,
					easing: 'ease-in',
				},
				{
					transform: `translate(0,${halfJump}px) rotate(${halfTilt}deg)`,
					easing: 'linear',
				},
				{ transform: 'translateY(0) rotate(0)' },
			],
			{ delay, duration: (200 + force * 250) * timeScale }
		)
		if (coinStacksComponent) setTimeout(() => coinStacksComponent.jostle(force), delay)
	}
</script>

<div class="container">
	{#if type === 'engine'}
		{#if gold}
			<svg viewBox="0 0 500 367" width="100" height="73" bind:this={carSVGelement}>
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
					<foreignObject
						id="Big-Wheel-Front"
						x="224.4"
						y="241.5"
						width="125"
						height="125"
					>
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
						style="fill:{baseColor};"
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
						style="fill:{baseColor};"
					/>
					<path
						id="Front-Gem-Center"
						d="M134.801,178.814l-22.569,22.569l-22.372,-22.594l22.372,-22.377l22.569,22.402Z"
						style="fill:{baseColor};"
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
						gradientTransform="matrix({reverse
							? '152,0,0,305,30,73'
							: '-152,0,0,-305,181,73'})"
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
		{:else}
			<svg viewBox="0 0 450 325" width="90" height="65" bind:this={carSVGelement}>
				<g class:reverse>
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
						style="fill:{_color}"
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
				</g>
			</svg>
		{/if}
	{:else if gold}
		<CoinStacks bind:this={coinStacksComponent} {reverse} />
		<svg viewBox="0 0 425 276" width="85" height="55" bind:this={carSVGelement}>
			<g class:reverse>
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
					style="fill:{baseColor};"
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
					style="fill:{baseColor};"
				/>
				<path
					id="Front-Gem-Center"
					d="M110.014,87.251l-22.569,22.569l-22.372,-22.595l22.372,-22.377l22.569,22.403Z"
					style="fill:{baseColor};"
				/>
				<Sparkle coords={SPARKLE_COORDS.car} {reverse} />
			</g>
			<defs>
				<linearGradient
					id="LG-Body"
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix({reverse
						? '-424,0,0,-212,424,12.5'
						: '424,0,0,212,1,12.5'})"
				>
					{@html GRADIENTS.gold}
				</linearGradient>
			</defs>
		</svg>
	{:else}
		<svg viewBox="0 0 375 300" width="75" height="60" bind:this={carSVGelement}>
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
		</svg>
	{/if}
</div>

<style>
	.container {
		margin: 0 3px;
		flex-shrink: 0;
		position: relative;
	}
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
