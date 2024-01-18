<script lang="ts">
	import { carHop } from '../../lib/animations'
	import type { GraceTrainCar } from 'grace-train-lib/data'
	import { Car } from 'grace-train-lib/components'
	import { TRAIN } from '../../lib/constants'

	export let car: GraceTrainCar
	export let reverse: boolean

	let svgElement: SVGElement

	export function hop(delay: number, force: number) {
		carHop(svgElement, delay, force, reverse)
	}
</script>

<Car {car} width="{TRAIN.carWidth}px" bind:svgElement />
