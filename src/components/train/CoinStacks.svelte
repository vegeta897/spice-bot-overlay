<script lang="ts">
	import { randomIntRange } from '../../lib/util'

	export let reverse: boolean

	const stackGroupElements: SVGGElement[] = []
	const segmentRectElements: SVGRectElement[][] = []

	const coinWidth = 25
	const coinThick = 7
	const centerX = (100 - coinWidth) / 2

	function buildStacks() {
		const stacks = []
		const minX = randomIntRange(8, 12)
		let maxX = 0
		let x = minX
		const prevHeights = [0, 0]
		const xLimit = 100 - coinWidth - 8
		let zIndex = Math.random() > 0.5 ? 1 : -1
		while (x <= xLimit) {
			maxX = x
			const central = 1 - Math.abs(x - centerX) / centerX
			const minHeight = Math.round(4 + central * 3)
			const maxHeight = Math.round(5 + central * 4)
			let height = randomIntRange(minHeight, maxHeight)
			while (prevHeights.includes(height)) {
				height++
			}
			prevHeights[1] = prevHeights[0]
			prevHeights[0] = height
			const minSplits = Math.min(3, Math.round(height / 4))
			const maxSplits = Math.min(7, Math.round(height / 2))
			const splitSegments = randomIntRange(minSplits, maxSplits)
			const segments = new Array(splitSegments + 1)
			segments.fill(1)
			segments[0] = height - splitSegments
			const baseY = Math.round(central * coinThick)
			stacks.push({ x, baseY, segments, zIndex })
			zIndex *= -1
			x += randomIntRange(Math.round(12 - central * 5), Math.round(25 - central * 5))
		}
		stacks[0].zIndex = 2
		stacks.at(-1).zIndex = 2
		stacks.sort((a, b) => b.zIndex - a.zIndex)
		const xAdjust = Math.round((xLimit - maxX - (minX - 8)) / 2)
		return stacks.map(({ x, baseY, segments }) => {
			const segmentXs = []
			const segmentYs = []
			let y = 0
			let xShift = 0
			for (const segment of segments) {
				y += segment
				segmentYs.push(y)
				segmentXs.push(xShift)
				xShift += randomIntRange(-2, 2)
			}
			return { x: x + xAdjust, baseY, segments, segmentYs, segmentXs }
		})
	}

	const stacks = buildStacks()

	for (let i = 0; i < stacks.length; i++) {
		segmentRectElements.push([])
	}

	const timeScale = 1

	export function jostle(force: number) {
		for (let i = 0; i < stacks.length; i++) {
			const stack = stacks[i]
			const shimmy = Math.round((stack.x / 6) * force)
			const height = Math.round(20 * force)
			const rotate = Math.round(height / 3)
			const stackDelay = (70 - stack.x) * 1 * timeScale
			const duration = (200 + force * 200) * timeScale
			const stackGroupElement = stackGroupElements[i]
			if (force === 1) stackGroupElement.style.transform = `translateX(-${stack.x / 2}px)`
			const animation = stackGroupElement.animate(
				[
					{ easing: 'ease-out' },
					{
						transform: `translate(-${shimmy}px, -${height / 2}px) rotate(-${rotate}deg)`,
						easing: 'ease-out',
					},
					{
						transform: `translate(-${shimmy / 2}px, -${height}px) rotate(-${
							rotate / 2
						}deg)`,
						easing: 'ease-in',
					},
					{ transform: `translate(0, -${height / 4}px)` },
					{ transform: 'translate(0, 0)' },
				],
				{ delay: stackDelay, duration }
			)
			if (force === 1) animation.onfinish = () => (stackGroupElement.style.transform = '')
			let segmentCumulativeHeight = 0
			for (let s = 1; s < stack.segments.length; s++) {
				const segmentJumpHeight = segmentCumulativeHeight + force * 5 * Math.random()
				segmentCumulativeHeight += segmentJumpHeight
				const segmentRotation =
					Math.round(segmentJumpHeight * 0.3) * (Math.random() > 0.5 ? 1 : -1)
				const segmentShiftX = Math.round((s - 1) ** 1.8 * force)
				segmentRectElements[i][s].animate(
					[
						{},
						{
							transform: `translate(${segmentShiftX}px,0) rotate(0)`,
							easing: 'ease-out',
						},
						{
							transform: `translate(0,-${Math.round(
								segmentJumpHeight
							)}px) rotate(${segmentRotation}deg)`,
							easing: 'ease-in',
						},
						{ transform: 'translate(0,0)' },
					],
					{ duration: duration + segmentJumpHeight, delay: stackDelay }
				)
			}
		}
	}
</script>

<svg viewBox="0 0 100 100" width="91" height="91" class:reverse>
	{#each stacks as { x, baseY, segments, segmentYs, segmentXs }, st}
		<g bind:this={stackGroupElements[st]}>
			{#each segments as segment, sg}
				{@const segX = x + segmentXs[sg]}
				{@const segY = 100 - segmentYs[sg] * coinThick - baseY}
				<rect
					bind:this={segmentRectElements[st][sg]}
					x={segX}
					y={segY}
					width={coinWidth}
					height={segment * coinThick + 0.3}
					fill="url(#coin-stack{reverse ? '-reverse' : ''})"
					style="transform-origin: {segX + coinWidth / 2}px {segY + coinThick / 2}px"
				/>
			{/each}
		</g>
	{/each}
	<defs>
		<linearGradient id="coin-stack" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="#f4ce34" />
			<stop offset="0.19" stop-color="#ffefb0" />
			<stop offset="0.37" stop-color="#f4ce34" />
			<stop offset="0.7" stop-color="#e5ba0b" />
			<stop offset="1" stop-color="#ba9400" />
		</linearGradient>
		<linearGradient id="coin-stack-reverse" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stop-color="#ba9400" />
			<stop offset="0.19" stop-color="#e5ba0b" />
			<stop offset="0.37" stop-color="#f4ce34" />
			<stop offset="0.7" stop-color="#ffefb0" />
			<stop offset="1" stop-color="#f4ce34" />
		</linearGradient>
	</defs>
</svg>

<style>
	svg {
		position: absolute;
		bottom: 40px;
		left: -3px;
		overflow: visible;
	}
	.reverse {
		transform: scaleX(-1);
	}
	g {
		transform-origin: 50% 100%;
		will-change: transform;
	}
	rect {
		will-change: transform;
	}
</style>
