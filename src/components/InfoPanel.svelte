<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backIn, backOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/mock/loop'

	// TODO: Lose the shadows, create backgrounds?

	// TODO: Put it all in a rectangular panel
	// Expands when ended to show ending user

	// Make the background a train! Don't use boring rectangular edges

	export let train: Train

	let titleElement: SVGElement
	let sizeElement: HTMLDivElement
	let scoreElement: HTMLDivElement

	$: combo = train.graces.filter((g) => g.type !== 'end').length
	$: digits = combo.toString().padStart(2, ' ')

	function bounce(element: HTMLElement | SVGElement, force: number, delay = 0) {
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
		bounce(titleElement, 5)
		bounce(sizeElement, 10)
		bounce(scoreElement, 3, 120)
	}
</script>

<section
	in:fly={{ x: 600, duration: 500, easing: backOut }}
	out:fly={{ x: 600, duration: 500, easing: backIn }}
>
	<div class="main">
		<svg
			bind:this={titleElement}
			class="title"
			viewBox="0 0 220 120"
			width="220px"
			height="120px"
		>
			<defs>
				<linearGradient id="rainbowGradient" y2="-10%">
					<stop offset="0%" stop-color="#fdb4bc" />
					<stop offset="10%" stop-color="#d8d9ed" />
					<stop offset="20%" stop-color="#c8fbbf" />
					<stop offset="30%" stop-color="#a2efff" />
					<stop offset="40%" stop-color="#d8d9ed" />
					<stop offset="50%" stop-color="#fdb4bc" />
					<stop offset="60%" stop-color="#d8d9ed" />
					<stop offset="70%" stop-color="#c8fbbf" />
					<stop offset="80%" stop-color="#a2efff" />
					<stop offset="90%" stop-color="#d8d9ed" />
					<stop offset="100%" stop-color="#fdb4bc" />
				</linearGradient>
			</defs>
			<clipPath id="graceTrainClip">
				<text x="0px" y="49px" class="nunito">GRACE</text>
				<text x="2px" y="99px" class="nunito">TRAIN!</text>
			</clipPath>
			<g clip-path="url('#graceTrainClip')">
				<rect width="440px" height="120px" fill="url('#rainbowGradient')" />
			</g>
		</svg>
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
		width: 480px;
		height: 220px;
		padding: 12px;
		box-sizing: border-box;
		position: absolute;
		right: 80px;
		bottom: 80px;
		text-align: center;
		background: #222;
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

	.title {
		font-size: 56px;
		filter: drop-shadow(0 0 3px #000) drop-shadow(0 0 2px #000);
		transform-origin: 50% 50%;
	}

	.title rect {
		animation: 3s linear title-gradient-slide infinite;
	}

	@keyframes title-gradient-slide {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-220px);
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
