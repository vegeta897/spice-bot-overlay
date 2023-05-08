<script lang="ts">
	import { onMount } from 'svelte'
	import type { Train } from '../lib/trains'
	import { cubicOut, cubicIn } from 'svelte/easing'
	import { fade } from 'svelte/transition'
	import { grow, bounce } from '../lib/animations'
	import { onInterval, sleep } from '../lib/util'
	import Shatter from './Shatter.svelte'

	export let train: Train

	let progressElement: HTMLDivElement

	$: if (train.hype?.total) onHypeProgress()
	let displayedLevel = 1
	let displayedGoal = 1
	let displayedProgress = 0
	let levellingUp = false
	$: displayedPercent = Math.min(1, displayedProgress / displayedGoal)

	// onInterval(() => train.hype.level++, 3000)

	onMount(() => {
		onHypeProgress()
	})

	async function onHypeProgress() {
		if (levellingUp) return
		const levelUp = train.hype.level > displayedLevel
		if (!levelUp && train.hype.progress === displayedProgress) return
		if (levelUp) {
			levellingUp = true
			grow(progressElement, 2000)
			displayedProgress = displayedGoal
			await sleep(2000)
			levellingUp = false
		} else {
			bounce(progressElement, 5)
		}
		displayedLevel = train.hype.level
		displayedGoal = train.hype.goal
		displayedProgress = train.hype.progress
	}
</script>

<div
	bind:this={progressElement}
	class="progress"
	in:fade={{ duration: 300, delay: 1500, easing: cubicOut }}
	out:fade={{ duration: 200, delay: 200, easing: cubicIn }}
>
	<div class="level" class:level-2digit={displayedLevel.toString().length > 1}>
		LEVEL {displayedLevel}
	</div>
	{#if train.endTime}
		<div
			in:fade={{ duration: 500 }}
			style="white-space: nowrap; font-size: 28px; line-height: 40px;"
		>
			CHOO CHOO!
		</div>
	{:else}
		{#key displayedLevel}
			<div class="progress-bar-outer" out:fade={{ duration: 500 }}>
				<div class="progress-bar-inner-left-cap" />
				<div
					class="progress-bar-inner"
					style:transform="scaleX({(displayedPercent * 170) / 178})"
					style:transition-duration={levellingUp ? '1000ms' : '700ms'}
				/>
				<div
					class="progress-bar-inner-right-cap"
					style:transform="translateX({4 + displayedPercent * 170}px)"
					style:transition-duration={levellingUp ? '1000ms' : '700ms'}
				/>
			</div>
		{/key}
		{#if levellingUp} <Shatter /> {/if}
	{/if}
</div>

<style>
	.progress {
		display: flex;
		flex-direction: column;
		position: relative;
		background: #2538c4e7;
		justify-content: flex-start;
		align-items: stretch;
		margin-right: 0;
		width: 190px;
		height: 81px;
		padding: 8px 12px;
		border-radius: 16px;
	}

	.level {
		height: 44px;
		font-size: 47px;
		line-height: 44px;
		display: flex;
		justify-content: space-between;
		white-space: nowrap;
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
		transition: transform ease-out;
	}

	.progress-bar-inner {
		left: 7px;
		width: 179px; /* Extra pixel to cover tiny gap during transitions */
		transform-origin: 0%;
		transition: transform ease-out;
	}
</style>
