<script lang="ts">
	import TrainCar from './TrainCar.svelte'
	import Smoke from './Smoke.svelte'
	import { SCREEN, TRAIN } from '../lib/constants'
	import { sleep } from '../lib/util'
	import { getTrainWidth, type Train } from '../lib/trains'
	import { onMount } from 'svelte'
	import { deleteTrain } from '../lib/store'

	export let train: Train
	export let top = false

	let pixelsPerMs: number
	let durationPerScreen: number

	function updateTrainSpeed(speed: number) {
		pixelsPerMs = speed / 1000
		durationPerScreen = Math.round(SCREEN.width / pixelsPerMs)
	}
	updateTrainSpeed(TRAIN.speed)

	let trainContainer: HTMLDivElement
	let animation: Animation
	let translation = 100 // Percent
	let translateDelta = -100
	let animationDuration = durationPerScreen
	let reverse = false

	const reversalEvents = new EventTarget()

	const maxHopDistance = 8
	let lastImpulse = 0
	let cars: TrainCar[] = []
	$: if (cars.length > 0) onCarAdd()
	let showSmoke = false
	let reversalTimeout: number
	$: if (train.endUser) clearTimeout(reversalTimeout)

	function onCarAdd() {
		doImpulse()
		if (animation) scheduleReversal()
	}

	function scheduleReversal() {
		if (train.endUser) return
		const trainWidth = getTrainWidth(train.combo)
		const animationProgress = (animation?.currentTime || 0) / animationDuration
		let currentTranslation = translation + translateDelta * animationProgress
		if (reverse) currentTranslation *= -1 // Trust me it works
		const remainingScreens =
			currentTranslation / 100 + trainWidth / SCREEN.width
		const timeUntilReversal = Math.max(
			0,
			remainingScreens * durationPerScreen + TRAIN.departDelay
		)
		if (reversalTimeout) clearTimeout(reversalTimeout)
		reversalTimeout = setTimeout(() => {
			console.log('reverse!')
			reversalEvents.dispatchEvent(new Event('reverse'))
		}, timeUntilReversal)
	}

	function doImpulse() {
		const now = Date.now()
		for (let i = cars.length - 1; i >= 0; i--) {
			const fromEnd = cars.length - i - 1
			if (fromEnd > 0 && now - lastImpulse < 400) return
			if (fromEnd >= maxHopDistance) break
			cars[i].hop(fromEnd * 100, (maxHopDistance - fromEnd) / maxHopDistance)
		}
		lastImpulse = now
	}

	function slide(start: number, delta: number) {
		if (!trainContainer) return
		animationDuration = Math.round((Math.abs(delta) / 100) * durationPerScreen)
		return new Promise((resolve) => {
			animation = trainContainer.animate(
				[
					{ transform: `translateX(${start}%)` },
					{ transform: `translateX(${start + delta}%)` },
				],
				{ duration: animationDuration, easing: 'linear', fill: 'forwards' }
			)
			animation.onfinish = resolve
		})
	}

	async function finalSlide() {
		const trainWidth = getTrainWidth(train.combo)
		const remainingScreens = translation / 100 + trainWidth / SCREEN.width
		if (remainingScreens > 0) {
			translateDelta = Math.round(remainingScreens * (reverse ? 100 : -100))
			await slide(translation, translateDelta)
		}
		train.offScreen = true
		if (train.hideInfo) deleteTrain(train)
	}

	onMount(async () => {
		const departWait = train.departTime - Date.now()
		if (departWait > 0) await sleep(departWait)
		showSmoke = true
		scheduleReversal()
		while (trainContainer) {
			const nextAction = await Promise.race([
				slide(translation, translateDelta),
				new Promise((resolve) => {
					reversalEvents.addEventListener('reverse', () => resolve('reverse'))
				}),
			])
			if (nextAction !== 'reverse') {
				console.log('not reversing')
				translation += translateDelta
				if (
					(reverse && translation >= 100) ||
					(!reverse && translation <= -100)
				) {
					showSmoke = false
				}
			}
			if (train.endUser) {
				clearTimeout(reversalTimeout)
				finalSlide()
				break
			} else if (nextAction === 'reverse') {
				console.log('reversing')
				updateTrainSpeed(TRAIN.speed + train.combo)
				showSmoke = true
				reverse = !reverse
				translation = reverse ? -100 : 100
				translateDelta = reverse ? 100 : -100
				scheduleReversal()
			}
		}
	})
</script>

<div bind:this={trainContainer} class:top class:reverse>
	{#each train.colors as color, c (c)}
		<TrainCar
			{reverse}
			{color}
			type={c === 0 ? 'engine' : 'car'}
			bind:this={cars[c]}
		/>
	{/each}
	{#if showSmoke && !top}
		<Smoke {reverse} speed={pixelsPerMs} />
	{/if}
</div>

<style>
	div {
		display: flex;
		align-items: flex-end;
		position: absolute;
		bottom: 3px;
		width: 100%;
		white-space: nowrap;
		transform: translateX(100%);
		--train-base-color: #605de9;
		--train-pop-color: #ff538f;
	}
	div.top {
		bottom: auto;
		top: 4px;
	}
	div.reverse {
		flex-direction: row-reverse;
	}
</style>
