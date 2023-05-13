<script lang="ts">
	import { carHop } from '../../lib/animations'

	export let reverse: boolean
	export let color: string | null
	export let frog = false

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
		{#if frog}<g id="Frog">
				<path
					id="Torso"
					d="M399.581,99.933c-14.093,11.309 -22.896,6.162 -42.174,3.652c-11.081,-1.443 -22.671,-3.558 -35.24,-3.652c-11.168,-0.084 -17.387,-13.809 -22.585,-23.083l4.164,-10.751l100.836,18.677l-5.001,15.157Z"
					style="fill:#b49672;"
				/>
				<path
					id="Head"
					d="M303.746,66.099l6.65,-27.251l12.329,-15.597l10.807,-1.955l7.617,4.35l6.012,14.303l13.862,3.463l13.8,1.296l12.209,-11.323l8.548,-0.671l8.837,7.091l4.365,17.387l-0.963,15.12l-1.066,6.908l-2.609,6.538l-6.63,1.882l-8.992,1.223l-20.164,-0.426l-16.056,-2.684l-24.336,-5.776l-17.404,-8.26l-6.816,-5.618Z"
					style="fill:#cae472;"
				/>
				<path
					id="Belly"
					d="M310.562,71.717l1.749,-8.156l42.873,11.241l42.969,5.87l-0.639,6.968l-8.992,1.223l-20.164,-0.426l-16.056,-2.684l-24.336,-5.776l-17.404,-8.26Z"
					style="fill:#ffffbd;"
				/>
				<path
					id="Mouth"
					d="M317.315,61.557l13.572,6.28l17.472,5.512l17.65,2.932l24.06,-0.06l4.442,0.113"
					style="fill:none;stroke:#fca671;stroke-width:12px;stroke-linecap:square;"
				/>
				<path
					id="Left-Eye"
					d="M331.672,29.171c3.016,0.896 4.508,4.848 3.329,8.821c-1.18,3.973 -4.587,6.471 -7.603,5.576c-3.017,-0.896 -4.509,-4.848 -3.329,-8.821c1.179,-3.973 4.586,-6.471 7.603,-5.576Z"
					style="fill:#60674e;"
				/>
				<path
					id="Right-Eye"
					d="M393.264,40.266c3.032,0.434 5.029,4.029 4.457,8.022c-0.572,3.993 -3.498,6.882 -6.53,6.448c-3.032,-0.435 -5.029,-4.029 -4.457,-8.022c0.572,-3.993 3.498,-6.883 6.53,-6.448Z"
					style="fill:#60674e;"
				/>
				<path
					id="Left-Nostril"
					d="M350.09,53.513c1.484,0.133 2.564,1.635 2.41,3.352c-0.154,1.716 -1.484,3.002 -2.968,2.869c-1.484,-0.133 -2.563,-1.635 -2.409,-3.352c0.154,-1.717 1.484,-3.002 2.967,-2.869Z"
					style="fill:#b1c86f;"
				/>
				<path
					id="Right-Nostril"
					d="M366.775,56.557c1.453,0.33 2.322,1.962 1.94,3.643c-0.382,1.681 -1.871,2.777 -3.324,2.447c-1.453,-0.33 -2.322,-1.963 -1.94,-3.644c0.382,-1.68 1.872,-2.777 3.324,-2.446Z"
					style="fill:#b1c86f;"
				/>
				<path
					id="Raised-Arm"
					d="M260.098,39.367c-3.458,-8.497 10.012,-16.885 15.52,-5.538c12.363,25.465 28.128,32.27 28.128,32.27l18.753,33.789l-22.917,0.045c-0,-0 -24.384,-23.466 -39.484,-60.566Z"
					style="fill:#b49672;"
				/>
				<g class="waving-arm">
					<path
						id="Waving-Arm"
						d="M273.453,42.58c-0,0 -5.707,5.631 -11.594,-0.369c-5.032,-5.128 -0.191,-11.113 -0.191,-11.113l52.837,-52.154l4.46,4.958l7.067,3.789l-52.579,54.889Z"
						style="fill:#b49672;"
					/>
					<path
						id="Waving-Hand"
						d="M314.505,-21.944l2.626,-15.223l10.431,-14.721l3.147,1.04l-5.134,17.261l15.091,-11.687l2.229,2.249l-10.485,15.839l16.718,-8.459l2.681,2.735l-14.941,15.06l-10.836,4.653l-7.067,-3.789l-4.46,-4.958Z"
						style="fill:#cae472;"
					/>
				</g>
			</g>{/if}
	</g>
</svg>

<style>
	svg {
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 25px;
		overflow: visible;
	}
	g.reverse {
		transform: scaleX(-1);
		transform-origin: center;
	}
	.waving-arm {
		transform-origin: 268px 37px;
		animation: 0.8s ease-in infinite waving;
	}
	@keyframes waving {
		25%,
		75% {
			transform: rotate(-30deg);
			animation-timing-function: ease-out;
		}
		50% {
			transform: rotate(-55deg);
		}
	}
</style>
