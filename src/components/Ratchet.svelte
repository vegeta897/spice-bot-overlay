<script lang="ts">
	import { backOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'

	export let number: number
	export let digitWidth: number
</script>

<div class="digits">
	{#each number.toString() as digit}
		<div class="digit" style:width="{digitWidth}px">
			{#key digit}
				<span
					in:fly|global={{ y: 40, duration: 250, easing: backOut }}
					out:fly={{ y: -40, duration: 250 }}
				>
					{digit}
				</span>
			{/key}
		</div>
	{/each}
</div>

<style>
	.digits {
		line-height: 44px;
		margin-right: 3px;
		white-space: nowrap;
	}

	.digit {
		height: 44px;
		position: relative;
		display: inline-block;
	}

	.digit span {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
