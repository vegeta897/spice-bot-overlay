<script lang="ts">
	import { onMount } from 'svelte'
	import Coin from './Coin.svelte'
	import { onInterval } from '../lib/util'

	export let reverse = false
	export let speed: number // Pixels per ms

	const coins: Coin[] = []
	const coinDuration = 2500
	const coinRate = 150
	const coinCount = Math.ceil(coinDuration / coinRate)

	let containerElement: HTMLDivElement
	let nextCoinIndex = 0

	onInterval(animateCoin, coinRate)
	onMount(() => {
		for (let i = 0; i < coinCount; i++) {
			coins.push(new Coin({ target: containerElement }))
		}
	})

	function animateCoin() {
		const coinComponent = coins[nextCoinIndex]
		coinComponent.toss(speed, coinDuration)
		nextCoinIndex = (nextCoinIndex + 1) % coinCount
	}
</script>

<div class="coin-container" class:reverse bind:this={containerElement} />

<style>
	.coin-container {
		position: absolute;
		left: 8px;
		top: -20px;
	}
	.coin-container.reverse {
		left: auto;
		right: 7px;
		transform: scaleX(-1);
	}
</style>
