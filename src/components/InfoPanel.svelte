<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { backOut, cubicIn, cubicOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/trains'
	import TrainTrack from './TrainTrack.svelte'
	import { onMount } from 'svelte'

	// TODO: Show high scores after end

	// TODO: For subs, make displayed number increment one at a time
	// Use an async function that loops w/ sleep until displayed number reaches actual

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

	$: if (train.combo) {
		bounce(titleElement, 2)
		bounce(comboElement, 10)
		bounce(scoreElement, 3, 80)
	}
</script>

<section class="nunito" class:top>
	<TrainTrack />
	<div class="rail-content">
		<h1
			in:fly={{ x: 500, duration: 800, delay: 1000, easing: cubicOut }}
			out:fade={{ duration: 300, easing: cubicIn }}
			bind:this={titleElement}
		>
			<span style="font-size: 60px; line-height: 58px;">HYPE</span> TRAIN!
		</h1>
		<div class="stats">
			<div
				class="combo"
				in:fade={{ duration: 200, delay: 1200 }}
				out:fade={{ duration: 200, delay: 200, easing: cubicIn }}
				bind:this={comboElement}
			>
				{#each train.combo.toString() as digit}
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
				{#key train.combo}
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
				<Score {train} />
			</div>
		</div>
	</div>
	{#if train.endUser}
		<div
			class="end"
			in:fly={{ x: 300, duration: 500, easing: backOut }}
			out:fade={{ duration: 200, easing: cubicIn }}
		>
			<span>ENDED BY</span>
			<span class="pulse">{train.endUser} !</span>
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

	h1 {
		font-size: 48px;
		line-height: 45px;
		margin: 0;
		margin-left: 22px;
		width: 190px;
		padding: 5px 0 2px;
		border-radius: 20px;
		background: #5029c4e0;
		transform-origin: 50% 50%;
		position: relative;
		will-change: transform;
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

	.end {
		background: #df256dc3;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		position: relative;
		margin: 14px auto 0;
		padding: 6px 22px;
	}

	.end span:first-child {
		font-size: 24px;
	}

	.end span {
		font-size: 28px;
		line-height: 30px;
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
