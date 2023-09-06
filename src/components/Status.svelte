<script lang="ts" context="module">
	import { overlayStatus, type OverlayError } from '../lib/store'

	const errorMessages: Record<Exclude<OverlayError, null>, string> = {
		'need-reload': 'Reload required, try refreshing the browser source cache',
		'missing-key': 'Missing key, check the browser source URL',
		'invalid-key': 'Invalid key, contact bot admin for a new one',
	}
</script>

{#if $overlayStatus.error}
	<section>
		Spice Bot Overlay error: <span>{errorMessages[$overlayStatus.error]}</span>
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
	span {
		color: #eee;
	}
</style>
