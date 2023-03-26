<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backIn, backOut } from 'svelte/easing'
	import Score from './Score.svelte'

	// TODO: Lose the shadows, create backgrounds?

	export let train: any

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
	<h1 class="nunito" bind:this={h1Element}>GRACE<br />TRAIN!</h1>
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
			<svg class="x" viewBox="0 0 100 100" width="40" height="40">
				<path d="M20 20 L80 80 M80 20 L20 80" />
			</svg>
		{/key}
	</div>
	<div class="score-container" bind:this={scoreElement}>
		<Score {train} />
	</div>
	{#if train.endUser}
		<div class="end nunito">
			Ended by {train.endUser}!
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
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-content: flex-start;
	}

	h1 {
		font-size: 56px;
		line-height: 56px;
		width: 240px;
		height: 120px;
		margin: 0;
		filter: drop-shadow(0 0 3px #000) drop-shadow(0 0 2px #000);
		transform-origin: 50% 50%;
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

	.size {
		display: flex;
		color: #fff;
		justify-content: center;
		align-items: baseline;
		font-size: 74px;
		width: 200px;
		height: 120px;
	}

	.digit {
		width: 48px;
		height: 74px;
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

	.end {
		font-size: 36px;
		text-shadow: 0 0 3px #000, 0 0 4px #000, 0 0 5px #000;
	}
</style>
