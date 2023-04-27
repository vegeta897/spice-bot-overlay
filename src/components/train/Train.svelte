<script lang="ts">
	import TrainCar from './TrainCar.svelte'
	import Smoke from './Smoke.svelte'
	import { SCREEN, TRAIN } from '../../lib/constants'
	import { sleep } from '../../lib/util'
	import { getTrainWidth, type Train } from '../../lib/trains'
	import { onMount } from 'svelte'
	import { deleteTrain, updateTrain } from '../../lib/store'
	import CoinSpout from './CoinSpout.svelte'

	export let train: Train
	export let top = false
	export let fade = 0
	export let hype = true

	let pixelsPerMs: number
	let durationPerScreen: number

	function updateTrainSpeed() {
		const speed = TRAIN.speed + train.combo * TRAIN.speedAddPerCombo
		pixelsPerMs = speed / 1000
		durationPerScreen = Math.round(SCREEN.width / pixelsPerMs)
	}
	updateTrainSpeed()

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

	$: opacity = 2 / (fade + 2)

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

	const timeScale = 1
	function doImpulse() {
		const now = Date.now()
		for (let i = cars.length - 1; i >= 0; i--) {
			const fromEnd = cars.length - i - 1
			// TODO: Use lastImpulse to pass a delta value for hopping cars mid-hop
			if (fromEnd > 0 && now - lastImpulse < 400) return
			if (fromEnd >= maxHopDistance) break
			cars[i].hop(fromEnd * 100 * timeScale, (maxHopDistance - fromEnd) / maxHopDistance)
		}
		lastImpulse = now
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

	async function finalSlide() {
		const trainWidth = getTrainWidth(train.combo)
		const remainingScreens = translation / 100 + trainWidth / SCREEN.width
		if (remainingScreens > 0) {
			translateDelta = Math.round(remainingScreens * (reverse ? 100 : -100))
			await slide(translation, translateDelta)
		}
		updateTrain({ id: train.id, offScreen: true })
		if (train.hideInfo) deleteTrain(train)
	}

	onMount(async () => {
		trainContainer.style.transform = 'translateX(0%)'
		showSmoke = true
		return
		const departWait = train.departTime - Date.now()
		if (departWait > 0) await sleep(departWait)
		showSmoke = true
		while (trainContainer) {
			const prevTrainSpeed = pixelsPerMs
			updateTrainSpeed()
			const speedRatio = prevTrainSpeed / pixelsPerMs
			const easing =
				speedRatio === 1 ? 'linear' : `cubic-bezier(0.5, ${0.5 * speedRatio}, 0.7, 0.7)`
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
			if (train.endUser) {
				clearTimeout(reversalTimeout)
				finalSlide()
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

<div bind:this={trainContainer} class:top class:reverse style:opacity>
	{#each train.colors as color, c (c)}
		<TrainCar
			{reverse}
			{color}
			gold={hype}
			number={c}
			type={c === 0 ? 'engine' : 'car'}
			bind:this={cars[c]}
		/>
	{/each}
	{#if showSmoke && !top}
		{#if hype}
			<CoinSpout {reverse} speed={pixelsPerMs} />
		{:else}
			<Smoke {reverse} speed={pixelsPerMs} />
		{/if}
	{/if}
</div>

<style>
	div {
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
		top: 4px;
	}
	div.reverse {
		flex-direction: row-reverse;
	}
</style>
