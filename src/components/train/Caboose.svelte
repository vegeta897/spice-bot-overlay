<script lang="ts">
	export let combo: number
	export let reverse: boolean

	let containerelement: HTMLDivElement

	export function hop() {
		containerelement.animate(
			[
				{
					transform: `translateX(${reverse ? '' : '-'}65px) scalex(0.8)`,
					easing: 'ease-out',
				},
				{
					transform: `translate(${reverse ? '' : '-'}5px,-7px) rotate(${
						reverse ? '-' : ''
					}12deg)`,
					easing: 'ease-out',
					offset: 0.25,
				},
				{
					transform: `translate(0,-14px) rotate(${reverse ? '-' : ''}8deg)`,
					easing: 'ease-in',
					offset: 0.5,
				},
				{},
			],
			{
				duration: 400 * 1,
			}
		)
	}
</script>

<div class="container" bind:this={containerelement}>
	<svg viewBox="0 0 425 385" width="85" height="77">
		<rect
			x="37.5"
			y="296.7"
			width="350"
			height="25"
			style="fill:#ec6896;stroke:#ff538f;"
		/>
		<circle cx="87.5" cy="346.7" r="25" style="fill:#605de9;stroke:#ff538f;" />
		<circle cx="337.5" cy="346.7" r="25" style="fill:#605de9;stroke:#ff538f;" />
		<rect
			x="37.5"
			y="121.7"
			width="350"
			height="175"
			style="fill:#605de9;stroke:#605de9;stroke-width:25.07px;"
		/>
		<rect
			x="125.1"
			y="36.7"
			width="175"
			height="60.87"
			style="fill:#605de9;stroke:#605de9;"
		/>
		<path
			d="M387.574,97.558l-350.051,-0l-24.99,24.154l399.941,0l-24.9,-24.154Z"
			style="fill:#ff538f;stroke:#ff538f;"
		/>
		<path
			d="M300.095,12.533l-175.031,0l-24.99,24.155l224.921,-0l-24.9,-24.155Z"
			style="fill:#ff538f;stroke:#ff538f;"
		/>
		<path d="M12.518,296.712l400,0" style="fill:none;stroke:#605de9;" />
	</svg>
	<div class="combo nunito" class:four-digit={combo.toString().length > 3}>{combo}</div>
</div>

<style>
	.container {
		margin: 0 3px;
		flex-shrink: 0;
		position: relative;
		will-change: transform;
		transform-origin: center;
	}
	svg {
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 25px;
	}
	.combo {
		position: absolute;
		width: 100%;
		text-align: center;
		top: 23px;
		font-size: 32px;
	}
	.combo.four-digit {
		font-size: 28px;
	}
</style>
