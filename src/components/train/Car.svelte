<script lang="ts">
	import { carHop } from '../../lib/animations'
	import type { GraceTrainCar } from 'grace-train-lib/trains'
	import { Car } from 'grace-train-lib/components'

	export let car: GraceTrainCar
	export let reverse: boolean

	let svgElement: SVGElement

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
	}
</script>

<!-- TODO: Increase size when depot site launches -->
<Car {car} width="75" bind:svgElement />
