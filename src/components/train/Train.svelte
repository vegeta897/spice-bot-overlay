<script lang="ts">
	import Smoke from './Smoke.svelte'
	import { SCREEN, TRAIN } from '../../lib/constants'
	import { sleep } from '../../lib/util'
	import {
		getTrainSize,
		getTrainWidth,
		graceToCar,
		hypeToCar,
		type Train,
	} from '../../lib/trains'
	import { onMount } from 'svelte'
	import { deleteStoreTrain, updateStoreTrain } from '../../lib/store'
	import CoinSpout from './CoinSpout.svelte'
	import Caboose from './Caboose.svelte'
	import Engine from './Engine.svelte'
	import Car from './Car.svelte'
	import GoldEngine from './GoldEngine.svelte'
	import GoldCar from './GoldCar.svelte'

	export let train: Train
	export let top = false
	export let fade = 0

	let pixelsPerMs: number
	let durationPerScreen: number

	function updateTrainSpeed() {
		const prevTrainSpeed = pixelsPerMs
		let comboSpeedBoost = getTrainSize(train) * TRAIN.speedAddPerCombo
		if (train.endTime && 'grace' in train) comboSpeedBoost *= 1.5
		pixelsPerMs = (TRAIN.speed + comboSpeedBoost) / 1000
		durationPerScreen = Math.round(SCREEN.width / pixelsPerMs)
		const speedRatio = prevTrainSpeed / pixelsPerMs
		const easing =
			speedRatio === 1 ? 'linear' : `cubic-bezier(0.5, ${0.5 * speedRatio}, 0.7, 0.7)`
		return easing
	}
	updateTrainSpeed()

	let trainContainer: HTMLDivElement
	let animation: Animation
	let translation = 100 // Percent of screen width
	let translateDelta = -100
	let animationDuration = 0 // Will be updated on first slide
	let reverse = false

	let cabooseComponent: Caboose

	const reversalEvents = new EventTarget()

	$: trainCars =
		'grace' in train
			? train.grace.graces.map(graceToCar)
			: train.hype.contributions.map(hypeToCar)
	let carsDisplayed = 0

	$: trainCars && onCarAdd()
	$: carAddDelay = 'grace' in train ? 400 : 500

	let newTrain = true
	let addingCars = false
	async function onCarAdd() {
		if (newTrain) {
			// Display all cars if the train was just created
			newTrain = false
			carsDisplayed = trainCars.length
			return
		}
		if (addingCars) return
		addingCars = true
		while (carsDisplayed < trainCars.length) {
			carsDisplayed++
			await sleep(carAddDelay)
		}
		addingCars = false
	}

	let carComponents: (Engine | Car | GoldEngine | GoldCar)[] = []
	$: if (carComponents.length > 0) onCarComponentAdd()
	$: opacity = 2 / (fade + 2)
	let showSmoke = false
	let reversalTimeout: number
	$: if (train.endTime) clearTimeout(reversalTimeout)
	$: if (train.endTime && 'grace' in train && !cabooseAdded) endGraceTrain()
	$: hypeGraces = 'hype' in train && train.hype.graces
	$: if (hypeGraces) onHypedGrace()

	let cabooseAdded = false
	function onHypedGrace() {
		if (!cabooseAdded) {
			cabooseAdded = true
			doImpulse()
			return
		}
		if (addingCars) return
		cabooseComponent?.miniHop()
		doImpulse(3, 0.5)
	}

	function onCarComponentAdd() {
		cabooseComponent?.hop()
		doImpulse()
		if (animation) scheduleReversal()
	}

	function endGraceTrain() {
		cabooseAdded = true
		doImpulse()
	}

	function doImpulse(maxHopDistance = 8, force = 1) {
		for (let i = carComponents.length - 1; i >= 0; i--) {
			if (!carComponents[i]) continue
			const fromEnd = carComponents.length - i - 1
			if (fromEnd >= maxHopDistance) break
			carComponents[i].hop(
				fromEnd * 90,
				(force * (maxHopDistance - fromEnd)) / maxHopDistance
			)
		}
	}

	function scheduleReversal() {
		if (train.endTime) return
		const trainWidth = getTrainWidth(train)
		const animationProgress =
			((animation?.currentTime as number) || 0) / animationDuration
		let currentTranslation = translation + translateDelta * animationProgress
		if (reverse) currentTranslation *= -1 // Trust me it works
		const remainingScreens = currentTranslation / 100 + trainWidth / SCREEN.width
		const timeUntilReversal = Math.max(
			0,
			remainingScreens * durationPerScreen + TRAIN.departDelay
		)
		if (reversalTimeout) clearTimeout(reversalTimeout)
		reversalTimeout = setTimeout(() => {
			reversalEvents.dispatchEvent(new Event('reverse'))
		}, timeUntilReversal)
	}

	function slide(start: number, delta: number, easing = 'linear') {
		if (!trainContainer) return
		animationDuration = Math.round((Math.abs(delta) / 100) * durationPerScreen)
		return new Promise((resolve) => {
			animation = trainContainer.animate(
				[
					{ transform: `translateX(${start}%)` },
					{ transform: `translateX(${start + delta}%)` },
				],
				{ duration: animationDuration, easing, fill: 'forwards' }
			)
			animation.onfinish = resolve
		})
	}

	async function finalSlide(easing = 'linear') {
		const trainWidth = getTrainWidth(train)
		const remainingScreens = Math.ceil(
			(translation * (reverse ? -1 : 1)) / 100 + trainWidth / SCREEN.width
		)
		if (remainingScreens > 0) {
			translateDelta = Math.round(remainingScreens * (reverse ? 100 : -100))
			await slide(translation, translateDelta, easing)
		}
		let updatedTrain = updateStoreTrain({ id: train.id, offScreen: true })
		if (!updatedTrain || updatedTrain.hideInfo) deleteStoreTrain(train)
	}

	onMount(async () => {
		if (train.static) {
			trainContainer.style.transform = 'translateX(0)'
			showSmoke = true
			// reverse = true
			return
		}
		const departWait = train.departTime - Date.now()
		if (departWait > 0) await sleep(departWait)
		showSmoke = true
		while (trainContainer) {
			const easing = updateTrainSpeed()
			const slideComplete = slide(translation, translateDelta, easing)
			scheduleReversal()
			const nextAction = await Promise.race([
				slideComplete,
				new Promise((resolve) => {
					reversalEvents.addEventListener('reverse', () => resolve('reverse'))
				}),
			])
			if (nextAction !== 'reverse') {
				translation += translateDelta
				if ((reverse && translation >= 100) || (!reverse && translation <= -100)) {
					showSmoke = false
				}
			}
			if (train.endTime) {
				clearTimeout(reversalTimeout)
				const easing = updateTrainSpeed()
				finalSlide(easing)
				break
			} else if (nextAction === 'reverse') {
				showSmoke = true
				reverse = !reverse
				translation = reverse ? -100 : 100
				translateDelta = reverse ? 100 : -100
			}
		}
	})
</script>

<div
	style:--carMargin="{TRAIN.carMargin}px"
	class="container"
	bind:this={trainContainer}
	class:top
	class:reverse
	style:opacity
>
	<div class="train-car-container">
		{#if 'hype' in train}
			<GoldEngine {reverse} bind:this={carComponents[0]} />
		{:else}
			<Engine
				{reverse}
				speed={pixelsPerMs}
				frog={train.grace.frog}
				bind:this={carComponents[0]}
			/>
		{/if}
	</div>
	{#each trainCars as car, c (c)}
		{#if c < carsDisplayed}
			<div class="train-car-container">
				{#if car.type === 'grace'}
					<Car {reverse} {car} bind:this={carComponents[c + 1]} />
				{:else}
					<GoldCar
						{reverse}
						color={car.color}
						type={car.bitsOrSubs}
						amount={car.amount}
						bind:this={carComponents[c + 1]}
					/>
				{/if}
			</div>
		{/if}
	{/each}
	<div class="train-car-container">
		{#if 'hype' in train && train.hype.graces}
			<Caboose bind:this={cabooseComponent} combo={train.hype.graces} {reverse} />
		{:else if 'grace' in train && train.endTime && train.endUser}
			<Caboose bind:this={cabooseComponent} combo={train.grace.combo} {reverse} />
		{/if}
	</div>
	{#if !top}
		{#if 'hype' in train}
			<CoinSpout {reverse} speed={pixelsPerMs} disable={!showSmoke} />
		{:else}
			<Smoke {reverse} speed={pixelsPerMs} disable={!showSmoke} />
		{/if}
	{/if}
</div>

<style>
	.container {
		display: flex;
		align-items: flex-end;
		position: absolute;
		bottom: 0;
		width: 100%;
		white-space: nowrap;
		transform: translateX(100%);
		--train-base-color: #605de9;
		--train-pop-color: #ff538f;
		transition: opacity 8s ease;
	}
	div.top {
		bottom: auto;
		top: 16px;
	}
	div.reverse {
		flex-direction: row-reverse;
	}
	.train-car-container {
		margin: 0 var(--carMargin);
		flex-shrink: 0;
		position: relative;
	}
</style>
