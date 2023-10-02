<script lang="ts">
	import { carHop } from '../../lib/animations'
	import { Body, ContainerSvg, Decal, Topper, Wheels } from 'grace-train-lib/components'
	import { COLORS } from 'grace-train-lib'
	import type { GraceTrainCar } from 'grace-train-lib/trains'

	export let car: GraceTrainCar
	export let reverse: boolean

	let svgElement: SVGElement

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
	}
</script>

<!-- TODO: Increase size when depot site launches -->
<ContainerSvg width="75" viewBox="0 0 375 300" bind:svgElement>
	{#if typeof car === 'string'}
		<Body name="boxy" stripeColor={car}></Body>
	{:else}
		<Body name={car.body} baseColor={car.bodyColor} popColor={car.bodyPopColor}>
			<svelte:fragment slot="decals">
				{#each car.decals as decal, d}
					<Decal
						name={decal.name}
						fill={decal.fill}
						transform={{
							x: decal.x,
							y: decal.y,
							scale: decal.scale,
							rotate: decal.rotate,
						}}
						params={decal.params}
					/>
				{/each}
			</svelte:fragment>
			<svelte:fragment slot="toppers" let:topLine>
				{#each car.toppers as topper}
					<Topper
						{topLine}
						name={topper.name}
						colors={topper.colors}
						position={topper.position}
						offset={topper.offset}
						scale={topper.scale}
						rotate={topper.rotate}
					/>
				{/each}
			</svelte:fragment>
			<Wheels
				rimColor={car.wheelColor}
				capColor={car.bodyColor || COLORS.BASE[3]}
				fromCenter={car.wheelFromCenter}
				slot="wheels"
			/>
		</Body>
	{/if}
</ContainerSvg>
