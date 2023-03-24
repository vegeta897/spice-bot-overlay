<script lang="ts">
	import { initChat } from './lib/mock/chat'
	import ChatPane from './lib/ChatPane.svelte'
	import Train from './lib/Train.svelte'
	import { initWebsocket } from './lib/websocket'
	import InfoPanel from './lib/InfoPanel.svelte'
	import { graceTrains } from './lib/store'

	initWebsocket()
	initChat()
</script>

<main>
	<div class="stream-container">
		<div class="stream">
			<div class="trains-container">
				{#each $graceTrains as train, t (train.startTime)}
					<Train {train} />
				{/each}
			</div>
			{#if $graceTrains.length > 0}
				{@const latestTrain = $graceTrains[$graceTrains.length - 1]}
				{#key latestTrain.startTime}<InfoPanel train={latestTrain} />{/key}
			{/if}
		</div>
	</div>
	<ChatPane />
</main>

<style>
	main {
		margin-left: 1rem;
		margin-top: 1rem;
		display: flex;
		height: calc(1080px / 2 + 2px);
		width: calc(1920px / 2 + 290px + 4px);
	}
	.stream-container {
		width: calc(1920px / 2);
		height: calc(1080px / 2);
		border: 1px solid #0008;
		overflow: hidden;
	}
	.stream {
		width: 1920px;
		height: 1080px;
		transform: scale(0.5);
		transform-origin: top left;
		background: url('/sample-stream.jpg');
		background-repeat: no-repeat;
	}
	.trains-container {
		position: absolute;
		top: calc(100% - 65px);
	}
</style>
