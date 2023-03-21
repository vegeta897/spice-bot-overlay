<script lang="ts">
	import { initChat } from './lib/mock/chat'
	import ChatPane from './lib/ChatPane.svelte'
	import Train from './lib/Train.svelte'
	import { initWebsocket } from './lib/websocket'
	import InfoPanel from './lib/InfoPanel.svelte'
	import { graces } from './lib/store'

	initWebsocket()
	initChat()
</script>

<main>
	<div class="stream-container">
		<div class="stream">
			{#if $graces.length > 0}
				<InfoPanel />
				<Train />
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
		width: calc(1920px / 2 + 280px + 4px);
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
</style>
