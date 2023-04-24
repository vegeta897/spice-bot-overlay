<script lang="ts">
	export let type: 'engine' | 'car' = 'car'
	export let color: string | null
	export let reverse = false
	export let gold = false

	$: _color = color ? `${color}cc` : 'var(--train-pop-color)'

	let svgElement: SVGElement

	// TODO: Allow users to pick their own decorations/colors?
	// Make a page with twitch oauth where they can customize it?!
	// Definitely do this idea. But migrate to mongo db first, to handle all those sessions and tokens
	/* Customization ideas:
			- subscriber-only decorations
			- mod-only decorations
			- particle fx
			- pride flags
	*/

	export function hop(delay: number, force: number) {
		const flipX = reverse ? -1 : 1
		const jump = Math.round(force * -20)
		const halfJump = Math.round(jump / 2)
		const shimmy = Math.round(force * -8) * flipX
		const halfShimmy = Math.round(shimmy / 2)
		const tilt = Math.round(force * 10) * flipX
		svgElement.animate(
			[
				{ transform: 'translate(0,0) rotate(0)', easing: 'linear' },
				{
					transform: `translate(${shimmy}px,${halfJump}px) rotate(${
						tilt * -1
					}deg)`,
					easing: 'ease-out',
				},
				{
					transform: `translate(${halfShimmy}px,${jump}px) rotate(0)`,
					easing: 'ease-in',
				},
				{
					transform: `translate(0,${halfJump}px) rotate(${tilt}deg)`,
					easing: 'linear',
				},
				{ transform: 'translateY(0) rotate(0)' },
			],
			{ delay, duration: 200 + force * 200 }
		)
	}
</script>

{#if type === 'engine'}
	{#if gold}
		<svg viewBox="0 0 450 325" width="90" height="65" bind:this={svgElement}>
			<g class:reverse>
				<path
					d="M86.933,287.5l-0,-50l325,0l-0,25l-100,0l-75,25l-150,0Z"
					style="fill:url(#_Linear1);stroke:url(#_Linear1);"
				/>
				<path
					d="M61.933,115.5c-31.865,20.125 -31.776,91.006 -0,110"
					style="fill:none;stroke:url(#_Radial3);"
				/>
				<path
					d="M126.21,112.5l16.83,-58.505l0,-41.495l-49.774,0l0,41.495l16.83,58.505l16.114,0Z"
					style="fill:url(#_Linear4);stroke:url(#_Linear4);"
				/>
				<path
					d="M61.933,112.5l-0,125l350,0l-0,-125l-350,0Zm350,125l25,0"
					style="fill:url(#_Linear6);stroke:url(#_Linear6);"
				/>
				<path
					d="M436.933,12.5l-175,0l25,0l-0,97m125,0l-0,-97"
					style="fill:none;stroke:url(#_Linear8);"
				/>
				<rect
					x="49.438"
					y="124.934"
					width="374.98"
					height="89.345"
					style="fill:{_color};fill-opacity:0.7;"
				/>
				<path
					d="M249.451,100.323l0,62.177"
					style="fill:none;stroke:url(#_Linear9);"
				/>
				<path
					d="M199.406,100.323l-0,62.177"
					style="fill:none;stroke:url(#_Linear9);"
				/>
				<foreignObject x="74.482" y="250.049" width="74.902" height="74.902">
					<div class="gold-wheel" />
				</foreignObject>
				<foreignObject x="149.384" y="250.049" width="74.902" height="74.902">
					<div class="gold-wheel" />
				</foreignObject>
				<foreignObject x="274.384" y="199.951" width="125.098" height="125.098">
					<div class="gold-wheel" />
				</foreignObject>
				<path
					d="M62.5,237.5l-50,50l50,0l0,-25l25,-25l-25,0Z"
					style="fill:url(#_Linear14);stroke:url(#_Linear14);"
				/>
			</g>
			<defs>
				<linearGradient
					id="_Linear1"
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(411.508,0,0,63.3088,0.425032,262.5)"
				>
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.28" stop-color="#be9c38" /><stop
						offset="0.48"
						stop-color="#eace50"
					/>
					<stop offset="0.67" stop-color="#fef9b5" /><stop
						offset="0.85"
						stop-color="#be9c38"
					/>
					<stop offset="1" stop-color="#eace50" />
				</linearGradient>
				<radialGradient
					id="_Radial3"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(1.22465e-14,200,-200,1.22465e-14,30.7131,119.99)"
				>
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.28" stop-color="#be9c38" />
					<stop offset="0.48" stop-color="#eace50" />
					<stop offset="0.67" stop-color="#fef9b5" />
					<stop offset="0.85" stop-color="#be9c38" />
					<stop offset="1" stop-color="#eace50" />
				</radialGradient>
				<linearGradient
					id="_Linear4"
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(-124.995,1.53075e-14,-3.07541e-14,-251.126,174.433,62.5)"
				>
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.28" stop-color="#be9c38" />
					<stop offset="0.48" stop-color="#eace50" />
					<stop offset="0.67" stop-color="#fef9b5" />
					<stop offset="0.85" stop-color="#be9c38" />
					<stop offset="1" stop-color="#eace50" />
				</linearGradient>
				<linearGradient
					id="_Linear6"
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(1.78459e-14,291.445,-194.297,1.18972e-14,399.729,-41.6857)"
				>
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.28" stop-color="#be9c38" />
					<stop offset="0.48" stop-color="#eace50" />
					<stop offset="0.67" stop-color="#fef9b5" />
					<stop offset="0.85" stop-color="#be9c38" />
					<stop offset="1" stop-color="#eace50" />
				</linearGradient>
				<linearGradient
					id="_Linear8"
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(1.75124e-14,286,-204.286,1.25089e-14,424.907,-35.6857)"
				>
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.28" stop-color="#be9c38" />
					<stop offset="0.48" stop-color="#eace50" />
					<stop offset="0.67" stop-color="#fef9b5" />
					<stop offset="0.85" stop-color="#be9c38" />
					<stop offset="1" stop-color="#eace50" />
				</linearGradient>
				<linearGradient
					id="_Linear9"
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(9.9872e-15,2e-06,-163.103,1.22465e-22,249.451,86.8471)"
				>
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.28" stop-color="#be9c38" />
					<stop offset="0.48" stop-color="#eace50" />
					<stop offset="0.67" stop-color="#fef9b5" />
					<stop offset="0.85" stop-color="#be9c38" />
					<stop offset="1" stop-color="#eace50" />
				</linearGradient>
				<linearGradient
					id="_Linear14"
					x1="0"
					y1="0"
					x2="1"
					y2="0"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(1.40796e-14,229.938,-153.292,9.38641e-15,43.31,82.7442)"
				>
					<stop offset="0" stop-color="#fef9b5" />
					<stop offset="0.28" stop-color="#be9c38" />
					<stop offset="0.48" stop-color="#eace50" />
					<stop offset="0.67" stop-color="#fef9b5" />
					<stop offset="0.85" stop-color="#be9c38" />
					<stop offset="1" stop-color="#eace50" />
				</linearGradient>
			</defs>
		</svg>
	{:else}
		<svg viewBox="0 0 450 325" width="90" height="65" bind:this={svgElement}>
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
	<svg viewBox="0 0 375 300" width="75" height="60" bind:this={svgElement}>
		<g class:reverse>
			<rect
				x="37.5"
				y="212.5"
				width="300"
				height="25"
				style="fill:none;stroke:url(#_Linear1);"
			/>
			<foreignObject x="49.951" y="224.951" width="75.098" height="75.098">
				<div class="gold-wheel" />
			</foreignObject>
			<foreignObject x="249.951" y="224.951" width="75.098" height="75.098">
				<div class="gold-wheel" />
			</foreignObject>
			<rect
				x="162.5"
				y="12.5"
				width="50"
				height="25"
				style="fill:none;stroke:url(#_Radial4);"
			/>
			<path
				d="M37.5,212.5l-25,-175l350,0l-25,175l-300,0Z"
				style="fill:url(#_Linear5);stroke:url(#_Linear5);"
			/>
			<path d="M12.5,212.5l350,0" style="fill:none;stroke:#e9cd50;" />
			<path
				d="M366.143,99.934l-357.286,0l8.144,56.945l340.998,0l8.144,-56.945Z"
				style="fill:{_color};fill-opacity:0.7;"
			/>
		</g>
		<defs>
			<linearGradient
				id="_Linear1"
				x1="0"
				y1="0"
				x2="1"
				y2="0"
				gradientUnits="userSpaceOnUse"
				gradientTransform="matrix(4.28373,-241.814,20.1512,0.356977,187.5,326.314)"
			>
				<stop offset="0" stop-color="#fef9b5" />
				<stop offset="0.28" stop-color="#be9c38" />
				<stop offset="0.48" stop-color="#eace50" />
				<stop offset="0.67" stop-color="#fef9b5" />
				<stop offset="0.85" stop-color="#be9c38" />
				<stop offset="1" stop-color="#eace50" />
			</linearGradient>
			<radialGradient
				id="_Radial4"
				cx="0"
				cy="0"
				r="1"
				gradientUnits="userSpaceOnUse"
				gradientTransform="matrix(140.284,253.636,-253.636,140.284,162.5,-28.6857)"
				><stop offset="0" stop-color="#eace50" />
				<stop offset="0.15" stop-color="#be9c38" />
				<stop offset="0.33" stop-color="#fef9b5" />
				<stop offset="0.52" stop-color="#eace50" />
				<stop offset="0.72" stop-color="#be9c38" />
				<stop offset="1" stop-color="#fef9b5" />
			</radialGradient>
			<linearGradient
				id="_Linear5"
				x1="0"
				y1="0"
				x2="1"
				y2="0"
				gradientUnits="userSpaceOnUse"
				gradientTransform="matrix(350,0,0,175,12.5,125)"
			>
				<stop offset="0" stop-color="#fef9b5" />
				<stop offset="0.28" stop-color="#be9c38" />
				<stop offset="0.48" stop-color="#eace50" />
				<stop offset="0.67" stop-color="#fef9b5" />
				<stop offset="0.85" stop-color="#be9c38" />
				<stop offset="1" stop-color="#eace50" />
			</linearGradient>
		</defs>
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
			style="fill:{_color}"
		/>
	</svg>
{/if}

<style>
	svg {
		display: inline-block;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 25px;
		margin: 0 3px;
		flex-shrink: 0;
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
