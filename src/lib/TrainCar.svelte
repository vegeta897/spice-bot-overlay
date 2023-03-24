<script lang="ts">
	export let color: string

	// Draw with path data, and give each vertex random XY variation seeded by user ID
	// Or just variable width, height, skew, wheel size, wheel spacing, etc

	const hopEasing = 'cubic-bezier(0, 0.5, 1, 0.5)'

	export function hop(delay: number, force: number) {
		const height = Math.round(force * 20)
		const halfHeight = Math.round(force * 10)
		const tilt = Math.round(force * 10)
		svgElement.animate(
			[
				{ transform: 'translateY(0) rotate(0)' },
				{ transform: `translateY(-${halfHeight}px) rotate(-${tilt}deg)` },
				{ transform: `translateY(-${height}px) rotate(0)` },
				{ transform: `translateY(-${halfHeight}px) rotate(${tilt}deg)` },
				{ transform: 'translateY(0) rotate(0)' },
			],
			{ delay, duration: 200 + force * 200, easing: hopEasing }
		)
	}

	let svgElement: SVGElement
</script>

<svg viewBox="0 0 200 150" width="100" height="75" bind:this={svgElement}>
	<circle cx="50" cy="130" r="20" fill="#777" />
	<circle cx="150" cy="130" r="20" fill="#777" />
	<rect x="10" y="110" width="180" height="15" fill="#475062" />
	<path d="M20 110 h160 l20 -95 h-200 l20 95 Z" fill={color} />
	<rect x="75" y="0" width="50" height="15" fill={color} />
</svg>

<style>
	svg {
		display: inline-block;
		/* background-color: rgba(255, 255, 255, 0.1); */
	}
</style>
