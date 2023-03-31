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
</script>

<main
	style="--screen-width: {SCREEN.width}px; --screen-height: {SCREEN.height}px;"
>
	<div class="stream-container">
		<div
			class="stream"
			style="background: url('/sample-stream-{background}.jpg')"
		>
			<!-- <video autoplay muted loop>
				<source src="/sample-stream.mp4" type="video/mp4" />
			</video> -->
			<div class="trains-container">
				{#each $graceTrains as train, t (train.startTime)}
					<Train {train} />
				{/each}
			</div>
			{#if $graceTrains.length > 0}
				{@const latestTrain = $graceTrains[$graceTrains.length - 1]}
				{#if latestTrain.showInfo}
					{#key latestTrain.startTime}<InfoPanel train={latestTrain} />{/key}
				{/if}
			{/if}
		</div>
	</div>
	<ChatPane />
</main>
<section>
	<button on:click={changeBackground}>Change Stream BG</button>
</section>

<style>
	main {
		margin-left: 0.25rem;
		margin-top: 0.25rem;
		display: flex;
		height: calc(1080px / 2 + 2px);
		width: calc(var(--screen-width) / 2 + 290px + 4px);
	}
	.stream-container {
		width: calc(var(--screen-width) / 2);
		height: calc(var(--screen-height) / 2);
		border: 1px solid #0008;
		overflow: hidden;
	}
	.stream {
		width: var(--screen-width);
		height: var(--screen-height);
		transform: scale(0.5);
		transform-origin: top left;
		background-repeat: no-repeat;
	}
	video {
		position: absolute;
	}
	.trains-container {
		position: absolute;
		top: calc(100% - 75px);
		width: 100%;
	}
	section {
		padding: 0.5rem;
	}
</style>
