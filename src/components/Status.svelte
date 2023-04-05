<script lang="ts">
	import { overlayStatus } from '../lib/store'
</script>

{#if $overlayStatus.auth !== 'init' && $overlayStatus.auth !== 'success'}
	<section>
		Grace Train Overlay error: <code>{$overlayStatus.auth}</code>
	</section>
{/if}

<style>
	section {
		padding: 1rem;
		background: #000;
		font-size: 2rem;
		position: absolute;
		bottom: 0;
		color: #f32;
	}
	code {
		color: #eee;
	}
</style>
