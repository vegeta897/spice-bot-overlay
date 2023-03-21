<script lang="ts">
	import { graceTrains } from './store'
	import { fly } from 'svelte/transition'
	import { backOut } from 'svelte/easing'

	// TODO: Lose the shadows, create backgrounds?

	let h1Element: HTMLHeadingElement
	let sizeElement: HTMLDivElement

	$: digits = $graceTrains.length.toString().padStart(2, ' ')

	$: lastGrace = $graceTrains[$graceTrains.length - 1] || lastGrace

	$: if (digits && sizeElement && h1Element) {
		h1Element.animate(
			[
				{ transform: 'scale(100%)' },
				{ transform: 'scale(105%)' },
				{ transform: 'scale(100%)' },
			],
			{
				delay: 80,
				duration: 300,
				easing: 'cubic-bezier(0.12, 0.365, 0.55, 1.65)',
			}
		)
		sizeElement.animate(
			[
				{ transform: 'scale(100%)' },
				{ transform: 'scale(110%)' },
				{ transform: 'scale(100%)' },
			],
			{
				duration: 300,
				easing: 'cubic-bezier(0.12, 0.365, 0.55, 1.65)',
			}
		)
	}
</script>

<section>
	<h1 bind:this={h1Element}>GRACE TRAIN!</h1>
	<div class="size" bind:this={sizeElement}>
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
		{#key $graceTrains.length}
			<svg class="x" viewBox="0 0 100 100" width="38" height="38">
				<path d="M20 20 L80 80 M80 20 L20 80" />
			</svg>
		{/key}
	</div>
	{#if lastGrace}
		<div class="score">
			<!-- <div class="score-label">score</div> -->
			<div class="total">
				<span
					class="points"
					style="--totalScore: {lastGrace.totalScore +
						lastGrace.comboScore}; transition: --totalScore {Math.min(
						2000,
						Math.max(300, lastGrace.delta * 10)
					)}ms;"
				/> pts
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		width: 640px;
		height: 300px;
		padding: 0 40px;
		box-sizing: border-box;
		/* border: 1px solid white; */
		position: absolute;
		right: 0;
		bottom: 0;
		text-align: center;
	}

	h1,
	.size,
	.score {
		font-weight: 900;
		font-family: 'Nunito', sans-serif;
	}

	@supports (font-variation-settings: normal) {
		h1,
		.size,
		.score {
			font-family: 'NunitoVariable', sans-serif;
			font-variation-settings: 'wght' 900;
		}
	}

	h1 {
		font-size: 48px;
		line-height: 48px;
		margin: 0;
		filter: drop-shadow(0 0 3px #000) drop-shadow(0 0 2px #000);
		transform-origin: 50% 200%;
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
		0% {
			background-position: 0 50%;
		}
		100% {
			background-position: 400px 50%;
		}
	}

	.size {
		display: flex;
		color: #fff;
		justify-content: center;
		align-items: baseline;
		font-size: 64px;
	}

	.digit {
		width: 40px;
		height: 64px;
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
		top: 3px;
		stroke-width: 30px;
		stroke-linecap: round;
		stroke: #fff;
		filter: drop-shadow(0 0 2px #000) drop-shadow(0 0 2px #000);
		margin-left: 6px;
		animation-name: rotate-90;
		animation-duration: 300ms;
		animation-timing-function: cubic-bezier(0.12, 0.365, 0.55, 1.65);
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

	@property --totalScore {
		syntax: '<integer>';
		initial-value: 0;
		inherits: false;
	}

	.score {
		position: relative;
		margin-top: 18px;
		text-shadow: 0 0 3px #000, 0 0 3px #000, 0 0 3px #000;
	}
	.score .total {
		font-size: 36px;
	}
	.score .total .points {
		font-size: 56px;
		transition: --totalScore 1500ms;
		counter-reset: totalScore var(--totalScore);
	}
	.score .total .points::after {
		content: counter(totalScore);
	}
</style>
