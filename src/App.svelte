<script lang="ts">
	import { initDemo } from './lib/demo/loop'
	import ChatPane from './components/ChatPane.svelte'
	import Train from './components/train/Train.svelte'
	import PlanTrain from './components/PlanTrain.svelte'
	import { initWebsocket } from './lib/websocket'
	import InfoPanel from './components/InfoPanel.svelte'
	import PlanInfoPanel from './components/PlanInfoPanel.svelte'
	import { trains, overlayStatus } from './lib/store'
	import { SCREEN } from './lib/constants'
	import Status from './components/Status.svelte'

	const urlParams = new URLSearchParams(window.location.search)
	const demoMode = urlParams.has('demo')
	const fullDemoMode = urlParams.has('fulldemo')
	const widthOverride = parseInt(urlParams.get('w'))
	const heightOverride = parseInt(urlParams.get('h'))
	if (widthOverride > 0) SCREEN.width = widthOverride
	if (heightOverride > 0) SCREEN.height = heightOverride
	const planMode = urlParams.has('plan')

	if (demoMode) {
		initDemo(urlParams.has('hype'), urlParams.has('static'))
	} else {
		initWebsocket(urlParams.get('key'))
	}

	let background = 1
	function changeBackground() {
		background = 1 + (background % 5)
	}

	$: infoTrains = $trains.filter((g) => !g.hideInfo)
	$: top = $overlayStatus.position === 'top'
</script>

<Status />
<main
	style="--screen-width: {SCREEN.width}px; --screen-height: {SCREEN.height}px;"
	class:demo={demoMode && !fullDemoMode}
	class:top
>
	<div class="stream-container">
		<div class="stream">
			{#if demoMode && !fullDemoMode}
				<div
					class="stream-background"
					style="background: url('sample-stream-{background}.jpg')"
				/>
			{/if}
			<!-- <video autoplay muted loop style="position: absolute">
				<source src="/sample-stream.mp4" type="video/mp4" />
			</video> -->
			{#if infoTrains.length > 0}
				{@const latestInfoTrain = infoTrains[infoTrains.length - 1]}
				{#key latestInfoTrain.id}
					<InfoPanel train={latestInfoTrain} {top} />
				{/key}
			{/if}
			<div class="trains-container">
				{#if planMode}
					<PlanTrain />
				{/if}
				{#each $trains as train, t (train.id)}
					<Train {train} {top} fade={$trains.length - 1 - t} />
				{/each}
			</div>
			{#if planMode}
				<PlanInfoPanel />
			{/if}
		</div>
	</div>
	{#if demoMode && !fullDemoMode}
		<ChatPane />
	{/if}
</main>
{#if demoMode && !fullDemoMode}
	<section>
		<button on:click={changeBackground}>Change Stream BG</button>
	</section>
	<style>
		body {
			background: #121214;
			overflow: visible;
		}
	</style>
{/if}

<style>
	main {
		display: flex;
	}
	main.demo {
		margin-left: 0.25rem;
		margin-top: 0.25rem;
		height: calc(var(--screen-height) / 2 + 2px);
		width: calc(var(--screen-width) / 2 + 290px + 4px);
	}
	.stream-container {
		width: var(--screen-width);
		height: var(--screen-height);
		overflow: hidden;
		position: relative;
	}
	.demo .stream-container {
		width: calc(var(--screen-width) / 2);
		height: calc(var(--screen-height) / 2);
		border: 1px solid #0008;
	}
	.stream {
		width: var(--screen-width);
		height: var(--screen-height);
	}
	.demo .stream {
		transform-origin: top left;
		transform: scale(0.5);
	}
	.stream-background {
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
	}
	.trains-container {
		position: absolute;
		top: 100%;
		width: 100%;
	}
	.top .trains-container {
		top: 0;
	}
	section {
		padding: 0.5rem;
	}
</style>
