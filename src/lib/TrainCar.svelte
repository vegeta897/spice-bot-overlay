<script lang="ts">
	export let type: 'engine' | 'car' = 'car'
	export let color: string

	// Draw with path data, and give each vertex random XY variation seeded by user ID
	// Or just variable width, height, skew, wheel size, wheel spacing, etc

	export function hop(delay: number, force: number) {
		const height = Math.round(force * 20)
		const halfHeight = Math.round(force * 10)
		const tilt = Math.round(force * 10)
		svgElement.animate(
			[
				{ transform: 'translateY(0) rotate(0)', easing: 'linear' },
				{
					transform: `translateY(-${halfHeight}px) rotate(-${tilt}deg)`,
					easing: 'ease-out',
				},
				{ transform: `translateY(-${height}px) rotate(0)`, easing: 'ease-in' },
				{
					transform: `translateY(-${halfHeight}px) rotate(${tilt}deg)`,
					easing: 'linear',
				},
				{ transform: 'translateY(0) rotate(0)' },
			],
			{ delay, duration: 200 + force * 200 }
		)
	}

	let svgElement: SVGElement
</script>

{#if type === 'engine'}
	<svg viewBox="0 0 104 72" width="104" height="72" bind:this={svgElement}>
		<path
			d="M98,58l-72,0l0,8l-24,0l16,-16l0,-16l8,0l0,-12l-4,0l0,-8l20,0l0,8l-4,0l0,12l20,0l0,-24l-4,0l0,-8l48,0l0,8l-4,0l0,48Zm-32,-44l0,20l24,0l0,-20l-24,0Z"
			style="fill:#40bad3;stroke:#212121;stroke-width:4px;"
		/>
		<circle
			cx="80"
			cy="56"
			r="14"
			style="fill:#257b8c;stroke:#212121;stroke-width:4px;"
		/>
		<circle
			cx="34"
			cy="60"
			r="10"
			style="fill:#257b8c;stroke:#212121;stroke-width:4px;"
		/>
	</svg>
{:else}
	<svg
		class="car"
		viewBox="0 0 200 150"
		width="80"
		height="60"
		bind:this={svgElement}
	>
		<circle cx="50" cy="130" r="20" fill="#777" />
		<circle cx="150" cy="130" r="20" fill="#777" />
		<rect x="10" y="110" width="180" height="15" fill="#475062" />
		<path d="M20 110 h160 l20 -95 h-200 l20 95 Z" fill={color} />
		<rect x="75" y="0" width="50" height="15" fill={color} />
	</svg>
{/if}

<style>
	svg {
		display: inline-block;
		/* background-color: rgba(255, 255, 255, 0.1); */
	}

	.car {
		margin: 0 2.5px;
	}
</style>
