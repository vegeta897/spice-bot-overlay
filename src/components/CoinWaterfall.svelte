<script lang="ts">
	import { onMount } from 'svelte'
	import { onInterval, randomElement, randomIntRange } from '../lib/util'
	import Coin from './train/Coin.svelte'
	import { fade } from 'svelte/transition'

	const coins: Coin[] = []
	const coinDuration = 1000
	const msPerCoin = 100
	const coinCount = Math.ceil(coinDuration / msPerCoin)

	let containerElement: HTMLDivElement

	onInterval(animateCoins, coinDuration)
	onMount(() => {
		for (let i = 0; i < coinCount; i++) {
			coins.push(new Coin({ target: containerElement }))
		}
		animateCoins()
	})

	const xRanges: [number, number][] = [
		[0, 162],
		[212, 394],
	]

	function animateCoins() {
		for (let i = 0; i < coins.length; i++) {
			const x = randomIntRange(...randomElement(xRanges))
			coins[i].drop(coinDuration, i * msPerCoin, x)
		}
	}
</script>

<div out:fade|global={{ duration: 200 }} class="coin-container" bind:this={containerElement} />

<style>
	.coin-container {
		position: absolute;
		left: 38px;
		top: 95px;
	}
</style>
