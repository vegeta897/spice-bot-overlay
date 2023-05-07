<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { backOut, cubicIn, cubicOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/trains'
	import TrainTrack from './TrainTrack.svelte'
	import { onMount } from 'svelte'
	import { onInterval, sleep } from '../lib/util'
	import Ratchet from './Ratchet.svelte'
	import { bounce, grow } from '../lib/animations'
	import Shatter from './Shatter.svelte'
	import CoinWaterfall from './CoinWaterfall.svelte'

	// TODO: Show high scores after end

	export let train: Train
	export let top = false

	let titleElement: HTMLHeadingElement
	let comboElement: HTMLDivElement
	let scoreElement: HTMLDivElement
	let progressElement: HTMLDivElement
	let shatterComponent: Shatter

	// onInterval(() => grow(progressElement), 3000)
	// onInterval(() => train.hype.level++, 3000)

	onMount(() => {
		onHypeProgress()
		setTimeout(() => (readyToBounce = true), 1700)
	})

	$: if (!train.hype && train.grace?.combo) onGraceCombo()

	let readyToBounce = false
	function onGraceCombo() {
		if (!readyToBounce) return
		bounce(titleElement, 4)
		bounce(comboElement, 10)
		bounce(scoreElement, 3, 80)
	}

	$: if (train.hype?.progress > 0 || train.hype?.level > 0) onHypeProgress()
	let prevLevel = 1
	let prevProgress = -1
	let displayedLevel = 1
	let displayedProgress = 0
	let levellingUp = false

	async function onHypeProgress() {
		if (!train.hype) return
		const levelUp = train.hype.level > prevLevel
		if (levelUp || train.hype.progress > prevProgress) {
			prevLevel = train.hype.level
			prevProgress = train.hype.progress
			if (levelUp) {
				levellingUp = true
				grow(progressElement, 2000)
				displayedProgress = train.hype.goal
				await sleep(2000)
				levellingUp = false
			} else if (!levellingUp) {
				bounce(progressElement, 5)
			}
			displayedLevel = train.hype.level
			displayedProgress = train.hype.progress
		}
	}
</script>

<section class="nunito" class:top class:hype={train.hype}>
	<TrainTrack />
	<div class="rail-content">
		{#if train.hype}
			{#if train.endTime}<CoinWaterfall />{/if}
			<div
				class="title-glow"
				style:animation-duration="2s"
				style:box-shadow="-5px -5px 25px #fffcd7"
			/>
			<div
				class="title-glow"
				style:animation-duration="3s"
				style:box-shadow="5px -5px 25px #fffcd7"
			/>
			<div
				class="title-glow"
				style:animation-duration="5s"
				style:box-shadow="-5px 5px 25px #fffcd7"
			/>
			<div
				class="title-glow"
				style:animation-duration="7s"
				style:box-shadow="5px 5px 25px #fffcd7"
			/>
		{/if}
		<div
			class="title"
			in:fly={{ x: 500, duration: 800, delay: 1000, easing: cubicOut }}
			out:fade={{ duration: 300, easing: cubicIn }}
		>
			<h1 bind:this={titleElement}>
				{#if train.hype}<span style="font-size: 64px; line-height: 58px;">HYPE</span
					>{:else}GRACE{/if} TRAIN!
			</h1>
		</div>
		<div class="stats">
			{#if train.grace && !train.hype}
				<div
					class="combo"
					in:fade={{ duration: 200, delay: 1200 }}
					out:fade={{ duration: 200, delay: 200, easing: cubicIn }}
					bind:this={comboElement}
				>
					<Ratchet number={train.grace.combo} digitWidth={28} />
					{#key train.grace.combo}
						<svg class="x" viewBox="0 0 100 100" width="26" height="26">
							<path d="M20 20 L80 80 M80 20 L20 80" />
						</svg>
					{/key}
				</div>
				<div
					class="score-container"
					in:fade={{ duration: 200, delay: 1300 }}
					out:fade={{ duration: 150, delay: 250, easing: cubicIn }}
					bind:this={scoreElement}
				>
					<Score score={train.grace.score} />
				</div>
			{/if}
			{#if train.hype}
				{@const percent = displayedProgress / train.hype.goal}
				<div
					bind:this={progressElement}
					class="progress"
					in:fade={{ duration: 300, delay: 1500, easing: cubicOut }}
					out:fade={{ duration: 200, delay: 200, easing: cubicIn }}
				>
					<div class="level" class:level-2digit={displayedLevel.toString().length > 1}>
						LEVEL {displayedLevel}
					</div>
					{#if train.endTime}
						<div
							in:fade={{ duration: 500 }}
							style="white-space: nowrap; font-size: 28px; line-height: 40px;"
						>
							CHOO CHOO!
						</div>
					{:else}
						{#key displayedLevel}
							<div class="progress-bar-outer" out:fade={{ duration: 500 }}>
								<div class="progress-bar-inner-left-cap" />
								<div
									class="progress-bar-inner"
									style:transform="scaleX({(percent * 170) / 178})"
									style:transition-duration={levellingUp ? '1000ms' : '700ms'}
								/>
								<div
									class="progress-bar-inner-right-cap"
									style:transform="translateX({4 + percent * 170}px)"
									style:transition-duration={levellingUp ? '1000ms' : '700ms'}
								/>
							</div>
						{/key}
						{#if levellingUp}
							<Shatter bind:this={shatterComponent} />
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	</div>
	{#if (train.hype && train.grace) || train.grace?.endUser}
		<div
			class="bottom"
			class:ended-by={!train.hype}
			in:fly={{
				x: train.hype ? 0 : 300,
				y: train.hype ? -50 : 0,
				duration: train.hype ? 300 : 500,
				easing: backOut,
			}}
			out:fade={{ duration: 200, easing: cubicIn }}
		>
			{#if !train.hype}
				<span>ENDED BY</span>
				<span class="pulse">{train.grace.endUser} !</span>
			{:else if train.grace}
				<div>
					<span style="font-size: 40px; line-height: 20px; position:relative; top: 2px;"
						>+</span
					>
					GRACE {train.grace.combo}<span style:margin-left="2px">x</span>
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
	section {
		width: 500px;
		height: 230px;
		padding: 12px;
		box-sizing: border-box;
		position: absolute;
		right: 0;
		bottom: 80px;
		text-align: center;
		display: flex;
		flex-direction: column;
		color: #fff;
	}

	section.top {
		bottom: calc(var(--screen-height) - 320px);
	}

	.rail-content {
		margin-top: 18px;
		height: 98px;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
	}

	.title {
		margin: 0;
		margin-left: 22px;
		width: 190px;
		padding: 5px 0 2px;
		border-radius: 20px;
		background: #5029c4e0;
		position: relative;
	}

	h1 {
		margin: 0;
		font-size: 48px;
		line-height: 45px;
		transform-origin: 50% 50%;
	}

	.hype .title {
		background: #6b22d9e8;
		margin-left: 24px;
		width: 194px;
		padding: 7px 0 4px;
	}

	.title-glow {
		position: absolute;
		top: 22px;
		left: 35px;
		width: 194px;
		height: 114px;
		border-radius: 20px;
		opacity: 0.6;
		animation: 2s ease-in-out infinite title-glowing;
	}

	@keyframes title-glowing {
		50% {
			opacity: 0.2;
		}
	}

	.hype h1 {
		font-size: 50px;
		background: linear-gradient(#fffcd7, #f5e396);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.stats {
		width: 233px;
		margin-right: 29px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.combo {
		display: flex;
		position: relative;
		background: #8a1145d7;
		justify-content: flex-end;
		align-items: flex-start;
		font-size: 44px;
		line-height: 44px;
		margin-right: 11px;
		margin-bottom: 6px;
		height: 45px;
		padding: 1px 9px;
		border-radius: 16px;
		transform-origin: 75% 50%;
	}

	.x {
		margin-top: 12px;
		margin-left: 1px;
		stroke-width: 30px;
		stroke-linecap: round;
		stroke: #fff;
		animation: 300ms cubic-bezier(0.12, 0.365, 0.55, 1.65) rotate-90;
		display: inline-block;
	}

	@keyframes rotate-90 {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(90deg);
		}
	}

	.score-container {
		transform-origin: 80% -100%;
		position: relative;
	}

	.progress {
		display: flex;
		flex-direction: column;
		position: relative;
		background: #2538c4e7;
		justify-content: flex-start;
		align-items: stretch;
		margin-right: 0;
		/* margin-bottom: 6px; */
		width: 190px;
		height: 81px;
		padding: 8px 12px;
		border-radius: 16px;
	}

	.level {
		height: 44px;
		font-size: 47px;
		line-height: 44px;
		display: flex;
		justify-content: space-between;
		white-space: nowrap;
	}

	.level.level-2digit {
		font-size: 41px;
	}

	.progress-bar-outer {
		width: 190px;
		height: 26px;
		padding: 3px;
		margin: 3px 0;
		border: 3px solid #fff;
		border-radius: 8px;
		box-sizing: border-box;
		position: absolute;
		top: 54px;
	}

	.progress-bar-inner-left-cap,
	.progress-bar-inner-right-cap,
	.progress-bar-inner {
		position: absolute;
		background: #fff;
		height: 14px;
	}

	.progress-bar-inner-left-cap {
		width: 4px;
		left: 3px;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
	}

	.progress-bar-inner-right-cap {
		width: 4px;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		transition: transform ease-out;
	}

	.progress-bar-inner {
		left: 7px;
		width: 179px; /* Extra pixel to cover tiny gap during transitions */
		transform-origin: 0%;
		transition: transform ease-out;
	}

	.bottom {
		background: #d83b72dd;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		position: relative;
		margin: 14px auto 0;
		padding: 6px 14px;
		font-size: 28px;
		line-height: 30px;
	}

	.ended-by {
		padding: 6px 22px;
		background: #df256dc3;
	}

	.ended-by span:first-child {
		font-size: 24px;
	}

	.pulse {
		animation: pulse 1000ms linear infinite;
	}

	@keyframes pulse {
		from,
		to {
			transform: scale(1);
		}
		10%,
		90% {
			transform: scale(1.01);
		}
		20%,
		80% {
			transform: scale(1.03);
		}
		40%,
		60% {
			transform: scale(1.08);
		}
		50% {
			transform: scale(1.1);
		}
	}
</style>
