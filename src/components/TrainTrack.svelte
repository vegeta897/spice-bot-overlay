<script context="module" lang="ts">
	import { fly } from 'svelte/transition'
	import { backIn } from 'svelte/easing'

	const rainbow = ['#fdb4bc', '#d8d9ed', '#c8fbbf', '#a2efff', '#d8d9ed']
</script>

<svg
	class="train-track"
	viewBox="0 0 540 160"
	width="540"
	height="160"
	out:fly|global={{ x: 400, duration: 500, easing: backIn }}
>
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
			x={29 + i * 80}
			y="8"
			width="40"
			height="145"
			style="animation-delay: {(6 - i) * 120}ms; transform-origin: {50 +
				i * 80}px 72.5px;"
			fill={rainbow[i % rainbow.length]}
			rx="8"
		/>
	{/each}
	<clipPath id="trackRailsClip">
		<rect width="540" height="20" x="8" y="24" rx="10" />
		<rect width="540" height="20" x="8" y="114" rx="10" />
	</clipPath>
	<g class="rail-group" clip-path="url('#trackRailsClip')">
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

<style>
	.train-track {
		position: absolute;
		top: 0;
		left: 0;
		filter: drop-shadow(0 0 3px #000a);
	}

	.train-track .rail-group {
		animation: 0.8s 0.6s ease-out slide-in;
		animation-fill-mode: both;
	}

	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0.5;
		}
	}

	.train-track .rail-gradient {
		/* Delay until after rails stop moving to avoid flickering in OBS */
		animation: 4s 1.4s linear rail-gradient-slide infinite;
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
		opacity: 0.8;
	}

	@keyframes slat-appear {
		from {
			transform: scaleY(0.2);
			opacity: 0;
		}
	}
</style>
