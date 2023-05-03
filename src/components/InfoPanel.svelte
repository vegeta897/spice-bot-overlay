<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { backOut, cubicIn, cubicOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/trains'
	import TrainTrack from './TrainTrack.svelte'
	import { onMount } from 'svelte'
	import { onInterval } from '../lib/util'

	// TODO: Show high scores after end

	// TODO: Leave progress at 100 for a bit before increasing displayed level

	export let train: Train
	export let top = false

	let titleElement: HTMLHeadingElement
	let comboElement: HTMLDivElement
	let scoreElement: HTMLDivElement

	function bounce(element: HTMLElement, force: number, delay = 0) {
		if (!readyToBounce || !element) return
		element.animate(
			[
				{ transform: 'scale(100%)', easing: 'ease-out' },
				{
					transform: `scale(${100 + force}%)`,
					easing: 'cubic-bezier(0.5, 0, 0.55, 1.65)',
					offset: 0.3,
				},
				{ transform: 'scale(100%)' },
			],
			{ delay, duration: 300 }
		)
	}

	let readyToBounce = false

	onMount(() => {
		setTimeout(() => (readyToBounce = true), 1700)
	})

	$: if (!train.hype && train.grace?.combo) {
		bounce(titleElement, 4)
		bounce(comboElement, 10)
		bounce(scoreElement, 3, 80)
	}
</script>

<section class="nunito" class:top class:hype={train.hype}>
	<TrainTrack />
	<div class="rail-content">
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
		<div class="grace-stats">
			{#if train.grace && !train.hype}
				<div
					class="combo"
					in:fade={{ duration: 200, delay: 1200 }}
					out:fade={{ duration: 200, delay: 200, easing: cubicIn }}
					bind:this={comboElement}
				>
					{#each train.grace.combo.toString() as digit}
						<div class="digit">
							{#key digit}
								<span
									in:fly={{ y: 40, duration: 250, easing: backOut }}
									out:fly|local={{ y: -40, duration: 250 }}
								>
									{digit}
								</span>
							{/key}
						</div>
					{/each}
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
				{@const percent = train.hype.progress / train.hype.goal}
				<div
					class="progress"
					in:fade={{ duration: 300, delay: 1500, easing: cubicOut }}
					out:fade={{ duration: 200, delay: 200, easing: cubicIn }}
				>
					<div class="level" class:level-2digit={train.hype.level.toString().length > 1}>
						LEVEL {train.hype.level}
					</div>
					{#key train.hype.level}
						<div
							in:fly|local={{ y: 24, duration: 300, delay: 200, easing: cubicOut }}
							out:fly|local={{ y: -24, duration: 300, easing: cubicIn }}
							class="progress-bar-outer"
						>
							<div class="progress-bar-inner-left-cap" />
							<div
								class="progress-bar-inner"
								style="transform: scaleX({(percent * 170) / 178})"
							/>
							<div
								class="progress-bar-inner-right-cap"
								style="transform: translateX({4 + percent * 170}px)"
							/>
						</div>
					{/key}
				</div>
			{/if}
		</div>
	</div>
	{#if (train.hype && train.grace) || train.grace?.endUser}
		<div
			class="bottom"
			class:ended-by={!train.hype}
			in:fly={{ x: 300, duration: 500, easing: backOut }}
			out:fade={{ duration: 200, easing: cubicIn }}
		>
			{#if !train.hype}
				<span>ENDED BY</span>
				<span class="pulse">{train.grace.endUser} !</span>
			{:else if train.grace}
				<div><span>+</span> GRACE {train.grace.combo}x</div>
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
		will-change: transform;
	}

	.hype .title {
		background: #6b22d9e8;
		margin-left: 24px;
		width: 194px;
		padding: 7px 0 4px;
	}

	.hype h1 {
		font-size: 50px;
		background: linear-gradient(#fffcd7, #f5e396);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.grace-stats {
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
		will-change: transform;
	}

	.digit {
		width: 28px;
		height: 44px;
		line-height: 44px;
		position: relative;
	}

	.digit span {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.x {
		margin-top: 12px;
		margin-left: 4px;
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
		will-change: transform;
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
		will-change: transform;
	}

	.level {
		font-size: 47px;
		line-height: 47px;
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
		transition: transform 500ms ease-out;
		will-change: transform;
	}

	.progress-bar-inner {
		left: 7px;
		width: 179px; /* Extra pixel to cover tiny gap during transitions */
		transform-origin: 0%;
		transition: transform 500ms ease-out;
		will-change: transform;
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

	.hype .bottom span {
		font-size: 32px;
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
