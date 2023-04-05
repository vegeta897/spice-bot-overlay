<script lang="ts">
	import { status } from '../lib/store'
</script>

{#if $status.auth !== 'init' && $status.auth !== 'success'}
	<section>
		Grace Train Overlay error: <code>{$status.auth}</code>
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
