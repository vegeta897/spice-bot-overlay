<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { backOut, cubicIn, cubicOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/trains'
	import TrainTrack from './TrainTrack.svelte'
	import { onMount } from 'svelte'
	import Ratchet from './Ratchet.svelte'
	import { bounce } from '../lib/animations'
	import CoinWaterfall from './CoinWaterfall.svelte'
	import HypeProgress from './HypeProgress.svelte'

	// TODO: Show high scores after end

	export let train: Train
	export let top = false

	let titleElement: HTMLHeadingElement
	let comboElement: HTMLDivElement
	let scoreElement: HTMLDivElement
	let bottomElement: HTMLDivElement

	onMount(() => {
		setTimeout(() => (readyToBounce = true), 1700)
	})

	$: graceCombo = 'grace' in train && train.grace.combo
	$: if (graceCombo) onGraceCombo()

	let readyToBounce = false
	function onGraceCombo() {
		if (!readyToBounce) return
		if ('hype' in train) bounce(bottomElement, 4)
		else {
			bounce(titleElement, 4)
			bounce(comboElement, 10)
			bounce(scoreElement, 3, 80)
		}
	}
</script>

<section class="nunito" class:top class:hype={'hype' in train}>
	<TrainTrack />
	<div class="rail-content">
		{#if 'hype' in train && train.endTime}<CoinWaterfall />{/if}
		<div
			bind:this={titleElement}
			class="title-container"
			in:fly|global={{ x: 500, duration: 800, delay: 1000, easing: cubicOut }}
			out:fade|global={{ duration: 300, easing: cubicIn }}
		>
			{#if 'hype' in train}
				<div in:fade|global={{ duration: 2000, delay: 1800 }}>
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
				</div>
			{/if}
			<div class="title">
				<h1>
					{#if 'hype' in train}<span style="font-size: 64px; line-height: 58px;"
							>HYPE</span
						>{:else}GRACE{/if} TRAIN!
				</h1>
			</div>
		</div>
		<div class="stats">
			{#if 'grace' in train}
				<div
					class="combo"
					in:fade|global={{ duration: 200, delay: 1200 }}
					out:fade|global={{ duration: 200, delay: 200, easing: cubicIn }}
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
					in:fade|global={{ duration: 200, delay: 1300 }}
					out:fade|global={{ duration: 150, delay: 250, easing: cubicIn }}
					bind:this={scoreElement}
				>
					<Score score={train.grace.score} />
				</div>
			{/if}
			{#if 'hype' in train}<HypeProgress {train} />{/if}
		</div>
	</div>
	{#if ('hype' in train && train.hype.graces) || train.endUser}
		<div
			bind:this={bottomElement}
			class="bottom"
			class:ended-by={'grace' in train}
			in:fly|global={{
				x: 'hype' in train ? 0 : 300,
				y: 'hype' in train ? -50 : 0,
				duration: 'hype' in train ? 300 : 500,
				delay: 'hype' in train && !readyToBounce ? 1600 : 0,
				easing: backOut,
			}}
			out:fade|global={{ duration: 200, easing: cubicIn }}
		>
			{#if !('hype' in train)}
				<span>ENDED BY</span>
				<span class="pulse">{train.endUser} !</span>
			{:else}
				<div>
					<span style="font-size: 40px; line-height: 20px; position:relative; top: 2px;"
						>+</span
					>
					GRACE {train.hype.graces}<span style:margin-left="2px">x</span>
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
		bottom: 90px;
		text-align: center;
		display: flex;
		flex-direction: column;
		color: #fff;
	}

	section.top {
		bottom: calc(var(--screen-height) - 350px);
	}

	.rail-content {
		margin-top: 18px;
		height: 98px;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
	}

	.title-container {
		position: relative;
		margin-left: 22px;
		width: 190px;
	}

	.hype .title-container {
		margin-left: 24px;
		width: 194px;
	}

	.title {
		border-radius: 20px;
		background: #5029c4e0;
		padding: 5px 0 2px;
	}

	.hype .title {
		background: #6b22d9e8;
		padding: 7px 0 4px;
	}

	h1 {
		margin: 0;
		font-size: 48px;
		line-height: 45px;
		transform-origin: 50% 50%;
	}

	.title-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 20px;
		opacity: 0.2;
		animation: 2s ease-in-out infinite title-glowing;
	}

	@keyframes title-glowing {
		50% {
			opacity: 0.6;
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
