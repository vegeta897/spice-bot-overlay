<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backIn, backOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/mock/loop'
	import TrainTrack from './TrainTrack.svelte'

	// TODO: Show high scores after end

	export let train: Train

	let titleElement: HTMLHeadingElement
	let comboElement: HTMLDivElement
	let scoreElement: HTMLDivElement

	$: combo = train.graces.filter((g) => g.type !== 'end').length

	function bounce(element: HTMLElement, force: number, delay = 0) {
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
			{
				delay,
				duration: 300,
			}
		)
	}

	$: if (combo && comboElement) {
		bounce(titleElement, 5)
		bounce(comboElement, 10)
		bounce(scoreElement, 3, 120)
	}
</script>

<section class="nunito" out:fly={{ x: 400, duration: 500, easing: backIn }}>
	<TrainTrack />
	<div class="rail-content">
		<h1 bind:this={titleElement}>GRACE TRAIN!</h1>
		<div class="stats">
			<div class="combo" bind:this={comboElement}>
				{#each combo.toString() as digit}
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
				{#key combo}
					<svg class="x" viewBox="0 0 100 100" width="26" height="26">
						<path d="M20 20 L80 80 M80 20 L20 80" />
					</svg>
				{/key}
			</div>
			<div class="score-container" bind:this={scoreElement}>
				<Score {train} />
			</div>
		</div>
	</div>
	{#if train.endUser}
		<div class="end" in:fly={{ y: 200, duration: 400, easing: backOut }}>
			<h2>ENDED BY</h2>
			<h2 class="pulse">{train.endUser} !</h2>
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
		background: #5029c4d0;
		transform-origin: 50% 50%;
		position: relative;
		will-change: transform;
	}

	.stats {
		width: 243px;
		margin-right: 19px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.combo {
		display: flex;
		position: relative;
		background: #8a1145c7;
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

	.end h2:first-child {
		font-size: 30px;
		margin-top: 24px;
	}

	.end h2 {
		margin: 0;
		font-size: 36px;
		line-height: 40px;
		text-shadow: 0 0 3px #000, 0 0 4px #000, 0 0 5px #000;
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
