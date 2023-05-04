<script lang="ts">
	import { clamp, randomElement, randomIntRange, randomRange } from '../../lib/util'

	export let reverse: boolean
	export let type: 'bits' | 'subs'
	export let amount: number

	$: value = Math.min(500, type === 'subs' ? amount * 500 : amount)
	$: coinCount = 5 + Math.floor(value / 20)
	$: if (coinCount) coinStacks = buildCoinStacks()

	let coinStacks: {
		x: number
		baseY: number
		staticCoins: number
		coinXs: number[]
	}[] = []

	const stackGroupElements: SVGGElement[] = []
	const coinRectElements: SVGRectElement[][] = []

	const coinDiameter = 25
	const coinThick = 7
	const padding = 8
	const xLimit = 100 - coinDiameter - padding
	const xRange = xLimit - padding

	function buildCoinStacks() {
		const stackCount = clamp(Math.ceil(coinCount / 5), 3, 5)
		const maxCoinStack = 3 + (coinCount / stackCount) * 1.2
		const stackPositions: { x: number; central: number; zIndex: number }[] = []
		const stackXstep = Math.min(coinDiameter, xRange / (stackCount - 1))
		const totalStackWidth = (stackCount - 1) * stackXstep
		const xCentering = (xRange - totalStackWidth) / 2
		let zIndex = Math.random() > 0.5 ? 1 : -1
		for (let i = 0; i < stackCount; i++) {
			const x = Math.round(padding + stackXstep * i + xCentering)
			const central = 1 - Math.abs(i + 0.5 - stackCount / 2) / (stackCount / 2)
			stackPositions.push({ x, central, zIndex })
			zIndex *= -1
		}
		stackPositions[0].zIndex = 2
		stackPositions.at(-1).zIndex = 2
		stackPositions.sort((a, b) => b.zIndex - a.zIndex)
		const stacks = stackPositions.map((p) => ({ ...p, coins: 3 }))
		const nonFullStacks = [...stacks]
		for (let i = stackCount * 2; i < coinCount; i++) {
			if (nonFullStacks.length === 0) {
				// This will never happen, but just in case I break it later
				break
			}
			const stack = randomElement(nonFullStacks)
			if (0.2 + stack.central * 0.8 > Math.random()) {
				stack.coins++
				if (stack.coins === maxCoinStack)
					nonFullStacks.splice(nonFullStacks.indexOf(stack), 1)
			} else i--
		}
		coinRectElements.length = 0
		for (let i = 0; i < stacks.length; i++) {
			coinRectElements.push([])
		}
		return stacks.map(({ x, central, coins }) => {
			const minAnimatedCoins = Math.min(3, coins / 5)
			const maxAnimatedCoins = Math.min(8, coins / 3)
			const animnatedCoins = Math.round(randomRange(minAnimatedCoins, maxAnimatedCoins))
			const staticCoins = coins - animnatedCoins
			const coinXs = []
			let xShift = 0
			for (let i = 0; i < coins; i++) {
				coinXs.push(xShift)
				const maxShift = i >= staticCoins ? 2 : 1
				xShift += randomIntRange(-maxShift, maxShift)
			}
			const baseY = Math.round(central * coinThick)
			return { x, baseY, staticCoins, coinXs }
		})
	}

	const timeScale = 1

	export function jostle(delay: number, force: number) {
		delay *= timeScale
		for (let s = 0; s < coinStacks.length; s++) {
			const stack = coinStacks[s]
			const shimmy = Math.round((stack.x / -6) * force)
			const height = Math.round(20 * force)
			const rotate = Math.round(height / -3)
			const stackDelay = (70 - stack.x) * 1 * timeScale
			const duration = (200 + force * 200) * timeScale
			const stackGroupElement = stackGroupElements[s]
			if (force === 1) stackGroupElement.style.transform = `translateX(${stack.x / -2}px)`
			const animation = stackGroupElement.animate(
				[
					{ easing: 'ease-out' },
					{
						transform: `translate(${shimmy}px, -${height / 2}px) rotate(${rotate}deg)`,
						easing: 'ease-out',
					},
					{
						transform: `translate(${shimmy / 2}px, -${height}px) rotate(${
							rotate / 2
						}deg)`,
						easing: 'ease-in',
					},
					{ transform: `translate(0, -${height / 4}px)` },
					{ transform: 'translate(0, 0)' },
				],
				{ delay: delay + stackDelay, duration }
			)
			if (force === 1) animation.onfinish = () => (stackGroupElement.style.transform = '')
			let coinCumulativeHeight = 0
			const stackCoinRectElements = coinRectElements[s]
			for (let c = stack.staticCoins; c < stackCoinRectElements.length; c++) {
				const coinJumpHeight = coinCumulativeHeight + force * 5 * Math.random()
				coinCumulativeHeight += coinJumpHeight
				const coinRotation =
					Math.round(coinJumpHeight * 0.3) * (Math.random() > 0.5 ? 1 : -1)
				const coinShiftX =
					Math.round((c - stack.staticCoins) * 5 * force) * (reverse ? -1 : 1)
				stackCoinRectElements[c].animate(
					[
						{},
						{
							transform: `translate(${coinShiftX}px,0) rotate(0)`,
							easing: 'ease-out',
						},
						{
							transform: `translate(0,-${Math.round(
								coinJumpHeight
							)}px) rotate(${coinRotation}deg)`,
							easing: 'ease-in',
						},
						{ transform: 'translate(0,0)' },
					],
					{ duration: duration + coinJumpHeight, delay: delay + stackDelay }
				)
			}
		}
	}
</script>

<svg viewBox="0 0 100 100" width="91" height="91" class:reverse>
	{#each coinStacks as { x, baseY, coinXs }, s}
		<g bind:this={stackGroupElements[s]}>
			{#each coinXs as coinX, c}
				{@const rectX = x + coinX}
				{@const rectY = 100 - c * coinThick - baseY}
				<!-- Using a reverse transform instead of reversed gradient,
				     because switching gradients causes a lag spike -->
				<g class:reverse style={`transform-origin: ${rectX + coinDiameter / 2}px`}>
					<rect
						bind:this={coinRectElements[s][c]}
						x={rectX}
						y={rectY}
						width={coinDiameter}
						height={coinThick + 0.3}
						fill="url(#coin-stack)"
						style={`transform-origin: ${rectX + coinDiameter / 2}px ${
							rectY + coinThick / 2
						}px`}
					/>
				</g>
			{/each}
		</g>
	{/each}
	<!-- <text
		fill="white"
		style="font-size: 24px; font-weight: 700; text-shadow: 0 0 1px black"
	>
		{value}
	</text>
	<text
		y="20"
		fill="white"
		style="font-size: 24px; font-weight: 700; text-shadow: 0 0 1px black"
	>
		{coinCount}
	</text>
	<text
		y="40"
		fill="white"
		style="font-size: 24px; font-weight: 700; text-shadow: 0 0 1px black"
	>
		{coinStacks.length}
	</text> -->
	<defs>
		<linearGradient id="coin-stack" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="#f4ce34" />
			<stop offset="0.19" stop-color="#ffefb0" />
			<stop offset="0.37" stop-color="#f4ce34" />
			<stop offset="0.7" stop-color="#e5ba0b" />
			<stop offset="1" stop-color="#ba9400" />
		</linearGradient>
	</defs>
</svg>

<style>
	svg {
		position: absolute;
		bottom: 50px;
		left: -3px;
		overflow: visible;
	}
	.reverse {
		transform: scaleX(-1);
	}
	g {
		transform-origin: 50% 100%;
	}
</style>
