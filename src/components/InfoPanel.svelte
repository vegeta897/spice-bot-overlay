<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backIn, backOut } from 'svelte/easing'
	import Score from './Score.svelte'
	import type { Train } from '../lib/mock/loop'

	// TODO: Show high scores after end

	export let train: Train

	let titleElement: HTMLHeadingElement
	let sizeElement: HTMLDivElement
	let scoreElement: HTMLDivElement

	$: combo = train.graces.filter((g) => g.type !== 'end').length

	const rainbow = ['#fdb4bc', '#d8d9ed', '#c8fbbf', '#a2efff', '#d8d9ed']

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

	$: if (combo && sizeElement) {
		bounce(titleElement, 5)
		bounce(sizeElement, 10)
		bounce(scoreElement, 3, 120)
	}
</script>

<section class="nunito" out:fly={{ x: 400, duration: 500, easing: backIn }}>
	<svg class="train-track" viewBox="0 0 540 160" width="540" height="160">
		<defs>
			<linearGradient id="rainbowGradient" y2="-5%">
				{#each Array(11) as _, i}
					<stop offset="{i * 10}%" stop-color={rainbow[i % rainbow.length]} />
				{/each}
			</linearGradient>
		</defs>
		{#each Array(6) as _, i}
			<rect
				class="slat"
				x={30 + i * 80}
				y="8"
				width="40"
				height="145"
				style="animation-delay: {(6 - i) * 150}ms; transform-origin: {50 +
					i * 80}px 72.5px;"
				fill={rainbow[i % rainbow.length]}
				rx="8"
			/>
		{/each}
		<clipPath id="trackRailsClip">
			<rect class="rail" x="8" y="24" rx="10" />
			<rect class="rail" x="8" y="114" rx="10" style="animation-delay: 0.3s" />
		</clipPath>
		<g clip-path="url('#trackRailsClip')">
			<rect
				class="rail-gradient"
				x="-40"
				y="24"
				width="1200"
				height="124"
				fill="url('#rainbowGradient')"
			/>
		</g>
	</svg>
	<div class="rail-content">
		<h1 bind:this={titleElement}>GRACE TRAIN!</h1>
		<div class="stats">
			<div class="size" bind:this={sizeElement}>
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

	.train-track {
		position: absolute;
		top: 0;
		left: 0;
		filter: drop-shadow(0 0 3px #000a);
	}

	.train-track .rail {
		width: 540px;
		height: 20px;
		animation: 0.8s 0.2s ease-out slide-in;
		animation-fill-mode: backwards;
	}

	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0.5;
		}
	}

	.train-track .rail-gradient {
		animation: 4s linear rail-gradient-slide infinite;
	}

	@keyframes rail-gradient-slide {
		to {
			transform: translateX(-600px);
		}
	}

	.train-track .slat {
		position: relative;
		animation: 400ms cubic-bezier(0.16, 0.41, 0.56, 1.32) slat-appear;
		animation-fill-mode: backwards;
	}

	@keyframes slat-appear {
		from {
			transform: scaleY(0.2);
			opacity: 0;
		}
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

	.size {
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
