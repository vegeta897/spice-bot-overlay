<script lang="ts">
	import { onMount } from 'svelte'
	import { randomRange } from '../lib/util'

	let svgElement: SVGElement

	onMount(() => {
		svgElement?.animate([{ easing: 'ease-in' }, { opacity: 1 }], {
			duration: 700,
			delay: 1300,
			fill: 'forwards',
		})
	})

	function shatter(node: SVGElement) {
		node.style.background = 'none'
		node.style.transform = 'scale(113%)'
		const shards = [...node.children]
		for (const shard of shards) {
			const shardData = shard.getAttribute('data-shard').split(',')
			const shardAngle = +shardData[0] * (Math.PI / 180)
			const shardDistance = +shardData[1]
			const x = Math.round(Math.cos(shardAngle) * shardDistance * randomRange(40, 100))
			const y = Math.round(Math.sin(shardAngle) * shardDistance * -randomRange(20, 90))
			shard.animate(
				[{ easing: 'ease-out' }, { transform: `translate(${x}px,${y}px)`, opacity: 0 }],
				{ duration: 300, fill: 'forwards' }
			)
		}
		return { duration: 300 }
	}
</script>

<svg viewBox="0 0 214 97" width="100%" height="100%" bind:this={svgElement} out:shatter>
	<path data-shard="20,2" d="M214,36l0,-17c0,-10 -8,-19 -18,-19l-8,0l5,16l21,19Z" />
	<path data-shard="204,2" d="M4,90c3,3 8,6 13,6l8,0l20,-26l-28,5l-14,14Z" />
	<path data-shard="210,2" d="M26,97l22,0l15,-15l-16,-10l-20,26Z" />
	<path data-shard="263,1" d="M83,97l33,0l-10,-48l-23,48Z" />
	<path data-shard="0,2" d="M214,64l0,-28l-4,-4l-45,8l11,14l39,9Z" />
	<path data-shard="226,2" d="M48,97l29,0l-14,-15l-15,15Z" />
	<path data-shard="338,2" d="M188,97l7,0c4,0 8,-1 11,-4l-32,-38l-14,16l28,26Z" />
	<path data-shard="178,1" d="M49,51l-5,-10l62,7l-57,2Z" />
	<path data-shard="163,1" d="M58,22l49,26l-62,-7l13,-18Z" />
	<path data-shard="115,1" d="M99,0l7,48l-43,-48l35,0Z" />
	<path data-shard="55,1" d="M142,0l13,5l-48,43l19,-48l15,0Z" />
	<path
		data-shard="160,2"
		d="M25,0l9,7l23,14l-13,18l-44,-15l0,-6c0,-10 8,-19 18,-19l7,0Z"
	/>
	<path data-shard="192,1" d="M47,70l2,-19l57,-2l-59,22Z" />
	<path data-shard="17,1" d="M163,40l-56,7l63,-33l-7,25Z" />
	<path data-shard="328,1" d="M153,87l-46,-39l53,22l-6,16Z" />
	<path data-shard="35,1" d="M155,5l15,10l-63,33l48,-43Z" />
	<path data-shard="318,2" d="M138,97l40,0l-25,-9l-15,9Z" />
	<path data-shard="84,1" d="M126,0l-27,0l7,48l19,-48Z" />
	<path data-shard="301,1" d="M117,97l-10,-48l46,39l-15,9l-20,0Z" />
	<path data-shard="209,1" d="M47,70l16,10l43,-33l-59,22Z" />
	<path data-shard="14,2" d="M163,40l45,-8l-16,-15l-29,24Z" />
	<path data-shard="1,1" d="M163,40l11,14l-67,-6l56,-7Z" />
	<path data-shard="24,2" d="M187,0l5,16l-29,24l7,-25l10,-15l6,0Z" />
	<path data-shard="142,1" d="M58,22l49,26l-43,-48l-5,22Z" />
	<path data-shard="143,2" d="M63,0l-0,-0l-37,0l9,7l23,14l5,-22Z" />
	<path data-shard="231,1" d="M77,97l-14,-15l43,-33l-23,48l-6,0Z" />
	<path data-shard="328,2" d="M179,97l-25,-9l6,-16l28,26l-9,0Z" />
	<path data-shard="346,1" d="M174,54l-14,16l-53,-22l67,6Z" />
	<path data-shard="34,2" d="M181,0l-12,0l-13,5l15,10l10,-15Z" />
	<path data-shard="178,2" d="M0,25l0,37l49,-11l-5,-10l-44,-15Z" />
	<path data-shard="346,2" d="M207,92l-32,-38l39,9l0,13c0,6 -2,11 -6,14Z" />
	<path data-shard="194,2" d="M47,70l-28,5l8,-8l22,-16l-2,19Z" />
	<path data-shard="44,2" d="M169,0l-26,0l13,5l13,-5Z" />
	<path data-shard="192,2" d="M0,63l0,14c0,4 1,9 4,12l22,-22l22,-16l-49,11Z" />
</svg>

<style>
	svg {
		background: #fff;
		border-radius: 16px;
		position: absolute;
		top: 0;
		left: 0;
		overflow: visible;
		opacity: 0;
	}
	path {
		fill: #fff;
		transform-origin: 30px 15px;
	}
</style>
