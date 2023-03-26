<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backIn, backOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/mock/loop'

	// TODO: Lose the shadows, create backgrounds?

	export let train: Train

	let h1Element: HTMLHeadingElement
	let sizeElement: HTMLDivElement
	let scoreElement: HTMLDivElement

	$: combo = train.graces.filter((g) => g.type !== 'end').length
	$: digits = combo.toString().padStart(2, ' ')

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

	$: if (digits && sizeElement) {
		bounce(h1Element, 5)
		bounce(sizeElement, 10)
		bounce(scoreElement, 3, 120)
	}
</script>

<section
	in:fly={{ x: 600, duration: 500, easing: backOut }}
	out:fly={{ x: 600, duration: 500, easing: backIn }}
>
	<div class="main">
		<h1 class="nunito rainbow-text" bind:this={h1Element}>GRACE TRAIN!</h1>
		<div class="stats">
			<div class="size nunito" bind:this={sizeElement}>
				{#each digits as digit}
					<div class="digit">
						{#key digit}
							<span
								in:fly={{ y: 40, duration: 250, easing: backOut }}
								out:fly={{ y: -40, duration: 250 }}
							>
								{digit}
							</span>
						{/key}
					</div>
				{/each}
				{#key combo}
					<svg class="x" viewBox="0 0 100 100" width="30" height="30">
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
		<div class="end nunito" in:fly={{ y: 200, duration: 400, easing: backOut }}>
			<h2>ENDED BY</h2>
			<h2 class="pulse">{train.endUser} !</h2>
		</div>
	{/if}
</section>

<style>
	section {
		width: 640px;
		height: 300px;
		padding: 0 40px;
		box-sizing: border-box;
		position: absolute;
		right: 0;
		bottom: 0;
		text-align: center;
	}

	.main {
		width: 100%;
		height: 120px;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}

	h1 {
		font-size: 56px;
		line-height: 56px;
		width: 220px;
		height: 120px;
		margin: 0;
		filter: drop-shadow(0 0 3px #000) drop-shadow(0 0 2px #000);
		transform-origin: 50% 50%;
	}

	.rainbow-text {
		background: linear-gradient(
			70deg,
			#fdb4bc 0%,
			#d8d9ed 18%,
			#c8fbbf 36%,
			#a2efff 64%,
			#d8d9ed 72%,
			#fdb4bc 100%
		);
		background-size: 400px;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient 4s linear infinite;
	}

	@keyframes gradient {
		from {
			background-position: 0 50%;
		}
		to {
			background-position: 400px 50%;
		}
	}

	.stats {
		width: 220px;
		margin-right: 20px;
	}

	.size {
		display: flex;
		color: #fff;
		justify-content: flex-end;
		align-items: flex-start;
		font-size: 52px;
		line-height: 52px;
		margin-right: 19px;
		height: 60px;
	}

	.digit {
		width: 32px;
		height: 52px;
		line-height: 52px;
		position: relative;
		text-shadow: 0 0 5px #000, 0 0 5px #000, 0 0 5px #000;
	}

	.digit span {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.x {
		position: relative;
		top: 15px;
		left: 6px;
		stroke-width: 30px;
		stroke-linecap: round;
		stroke: #fff;
		filter: drop-shadow(0 0 2px #000) drop-shadow(0 0 2px #000);
		/* margin-left: 6px; */
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
		width: 100%;
	}

	.end h2:first-child {
		font-size: 30px;
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
