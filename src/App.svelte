<script lang="ts">
	import { initChat } from './lib/mock/chat'
	import ChatPane from './components/ChatPane.svelte'
	import Train from './components/Train.svelte'
	import { initWebsocket } from './lib/websocket'
	import InfoPanel from './components/InfoPanel.svelte'
	import { graceTrains } from './lib/store'
	import { SCREEN } from './lib/constants'

	initWebsocket()
	initChat()

	let background = 1
	function changeBackground() {
		background = 1 + (background % 4)
	}

	$: infoTrains = $graceTrains.filter((g) => g.showInfo)

	// https://github.com/obsproject/obs-browser
	// TODO: Listen for obs stream events
	// Show placeholder elements when not streaming
	const browser = !window.obsstudio
</script>

<main
	style="--screen-width: {SCREEN.width}px; --screen-height: {SCREEN.height}px;"
	class:browser
>
	<div class="stream-container">
		<div class="stream">
			{#if browser}
				<div
					class="stream-background"
					style="background: url('/sample-stream-{background}.jpg')"
				/>
			{/if}
			<!-- <video autoplay muted loop style="position: absolute">
				<source src="/sample-stream.mp4" type="video/mp4" />
			</video> -->
			<div class="trains-container">
				{#each $graceTrains as train, t (train.startTime)}
					<Train {train} />
				{/each}
			</div>
			{#if infoTrains.length > 0}
				{@const latestTrain = infoTrains[infoTrains.length - 1]}
				{#key latestTrain.startTime}<InfoPanel train={latestTrain} />{/key}
			{/if}
		</div>
	</div>
	{#if browser}
		<ChatPane />
	{/if}
</main>
{#if browser}
	<section>
		<button on:click={changeBackground}>Change Stream BG</button>
	</section>
{/if}

<style>
	main {
		display: flex;
	}
	main.browser {
		margin-left: 0.25rem;
		margin-top: 0.25rem;
		height: calc(var(--screen-height) / 2 + 2px);
		width: calc(var(--screen-width) / 2 + 290px + 4px);
	}
	.stream-container {
		width: var(--screen-width);
		height: var(--screen-height);
		overflow: hidden;
	}
	.browser .stream-container {
		width: calc(var(--screen-width) / 2);
		height: calc(var(--screen-height) / 2);
		border: 1px solid #0008;
	}
	.stream {
		width: var(--screen-width);
		height: var(--screen-height);
	}
	.browser .stream {
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
	section {
		padding: 0.5rem;
	}
</style>
