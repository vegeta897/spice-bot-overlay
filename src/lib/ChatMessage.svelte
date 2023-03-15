<script lang="ts">
	import Redeem from './Redeem.svelte'

	export let username: string
	export let color: string
	export let text: string
	export let time: string
	export let highlight: boolean
	export let grace: boolean
	export let redeem: boolean
</script>

<div class:redeem>
	{#if redeem}
		<p class="faded">
			{grace ? `${username} redeemed GRACE` : 'Redeemed Highlight My Message'}
			<Redeem />
			{grace ? 250 : 100}
		</p>
	{/if}
	{#if !grace}
		<p>
			<span class="time faded">{time}</span><strong style="color:{color}"
				>{username}</strong
			><span>: </span><span class:highlight>{text}</span>
		</p>
	{/if}
</div>

<style>
	div {
		margin: 4px 2px;
		padding: 2px 0;
		border-left: 4px solid transparent;
	}
	.redeem {
		border-left-color: #adadb8;
	}

	p {
		margin: 0;
		padding: 3px 12px;
		font-size: 12px;
	}

	.faded {
		color: #adadb8;
	}

	.time {
		margin-right: 7px;
	}

	strong {
		font-weight: 700;
	}

	.highlight {
		background: #755ebc;
		border: 3px solid #755ebc;
		color: #fff;
	}
</style>
