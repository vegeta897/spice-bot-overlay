<script lang="ts">
	import { afterUpdate } from 'svelte'
	import ChatMessage from './ChatMessage.svelte'
	import { chat } from '../../lib/demo/chat'

	let messagesElement: HTMLDivElement

	afterUpdate(() => {
		messagesElement.scrollTop = messagesElement.scrollHeight
	})
</script>

<section>
	<div class="messages" bind:this={messagesElement}>
		{#each $chat as chatMessage}
			<ChatMessage {...chatMessage} />
		{/each}
	</div>
	<div class="chat-input">
		<div class="chat-input-bar" />
	</div>
</section>

<style>
	section {
		width: 290px;
		background: #18181b;
		border: 1px solid #0008;
		position: relative;
		padding-bottom: 38px;
	}

	.messages {
		overflow-y: hidden;
		height: 100%;
	}

	.chat-input {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 43px;
	}

	.chat-input-bar {
		width: calc(100% - 1rem);
		height: 30px;
		margin: 0.5rem;
		border-radius: 0.4rem;
		background: #3d3d40;
		cursor: text;
	}
</style>
