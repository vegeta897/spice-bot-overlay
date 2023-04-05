<script lang="ts">
	import { initChat } from './lib/mock/chat'
	import ChatPane from './components/ChatPane.svelte'
	import Train from './components/Train.svelte'
	import { initWebsocket } from './lib/websocket'
	import InfoPanel from './components/InfoPanel.svelte'
	import { graceTrains } from './lib/store'
	import { SCREEN } from './lib/constants'
	import Status from './components/Status.svelte'

	const urlParams = new URLSearchParams(window.location.search)
	const demoMode = urlParams.has('demo')
	const widthOverride = parseInt(urlParams.get('w'))
	const heightOverride = parseInt(urlParams.get('h'))
	if (widthOverride > 0) SCREEN.width = widthOverride
	if (heightOverride > 0) SCREEN.height = heightOverride

	if (demoMode) {
		initChat()
	} else {
		initWebsocket(urlParams.get('key'))
	}

	let background = 1
	function changeBackground() {
		background = 1 + (background % 5)
	}

	$: infoTrains = $graceTrains.filter((g) => !g.hideInfo)
</script>

<Status />
<main
	style="--screen-width: {SCREEN.width}px; --screen-height: {SCREEN.height}px;"
	class:demo={demoMode}
>
	<div class="stream-container">
		<div class="stream">
			{#if demoMode}
				<div
					class="stream-background"
					style="background: url('sample-stream-{background}.jpg')"
				/>
			{/if}
			<!-- <video autoplay muted loop style="position: absolute">
				<source src="/sample-stream.mp4" type="video/mp4" />
			</video> -->
			<div class="trains-container">
				{#each $graceTrains as train (train.id)}
					<Train {train} />
				{/each}
			</div>
			{#if infoTrains.length > 0}
				{@const latestInfoTrain = infoTrains[infoTrains.length - 1]}
				{#key latestInfoTrain.id}<InfoPanel train={latestInfoTrain} />{/key}
			{/if}
		</div>
	</div>
	{#if demoMode}
		<ChatPane />
	{/if}
</main>
{#if demoMode}
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
	section {
		padding: 0.5rem;
	}
</style>
