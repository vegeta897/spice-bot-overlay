<script lang="ts">
	import { onMount } from 'svelte'
	import Coin from './Coin.svelte'
	import { onInterval } from '../../lib/util'

	export let reverse = false
	export let speed: number // Pixels per ms

	const coins: Coin[] = []
	const coinDuration = 2500
	const msPerCoin = 125
	const coinCount = Math.ceil(coinDuration / msPerCoin)

	let containerElement: HTMLDivElement

	onInterval(animateCoins, coinDuration)
	onMount(() => {
		for (let i = 0; i < coinCount; i++) {
			coins.push(new Coin({ target: containerElement }))
		}
		animateCoins()
	})

	function animateCoins() {
		for (let i = 0; i < coins.length; i++) {
			coins[i].toss(speed, coinDuration, i * msPerCoin)
		}
	}
</script>

<div class="coin-container" class:reverse bind:this={containerElement} />

<style>
	.coin-container {
		position: absolute;
		left: 8px;
		bottom: 98px;
	}
	.coin-container.reverse {
		left: auto;
		right: 8px;
		transform: scaleX(-1);
	}
</style>
