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
		let prevHeight: number
		const xLimit = 100 - coinWidth - 8
		while (x <= xLimit) {
			maxX = x
			const central = 1 - Math.abs(x - centerX) / centerX
			const minHeight = Math.round(4 + central * 3)
			const maxHeight = Math.round(5 + central * 4)
			let height = randomIntRange(minHeight, maxHeight)
			if (height === prevHeight) height++
			prevHeight = height
			const splitSegments = randomIntRange(
				Math.max(0, height - 5),
				Math.round(height / 2)
			)
			const segments = new Array(splitSegments + 1)
			segments.fill(1)
			segments[0] = height - splitSegments
			stacks.push({
				x,
				baseY: Math.round(central * coinThick),
				segments,
			})
			x += randomIntRange(12, Math.round(25 - central * 5))
		}
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

	export function jumble(force: number) {
		// TODO: Chance of spawning a coin falling out of the car

		for (let i = 0; i < stacks.length; i++) {
			const stack = stacks[i]
			const shimmy = Math.round((stack.x / 6) * force)
			const height = Math.round(20 * force)
			const rotate = Math.round(height / 3)
			const stackDelay = (70 - stack.x) * 1 * timeScale
			const duration = (200 + force * 200) * timeScale
			stackGroupElements[i].animate(
				[
					{ transform: 'translate(0, 0)' },
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
			for (let s = 1; s < stack.segments.length; s++) {
				const segmentJumpHeight = Math.round(s ** 2 * 2 * force)
				const segmentRotation = Math.round(segmentJumpHeight * 0.3)
				const segmentShiftX = Math.round((s - 1) ** 2 * force)
				segmentRectElements[i][s].animate(
					[
						{ transform: 'translate(0,0) rotate(0)' },
						{
							transform: `translate(${segmentShiftX}px,0) rotate(${
								segmentRotation / 2
							}deg)`,
							easing: 'ease-out',
						},
						{
							transform: `translate(${
								segmentShiftX / 2
							}px,-${segmentJumpHeight}px) rotate(${segmentRotation}deg)`,
							easing: 'ease-in',
						},
						{ transform: 'translate(0,0)' },
					],
					{ duration: duration + s * 30, delay: stackDelay }
				)
			}
		}
	}
</script>

<svg viewBox="0 0 100 100" width="91" height="91" class:reverse>
	{#each stacks as { x, baseY, segments, segmentYs, segmentXs }, st}
		<g bind:this={stackGroupElements[st]}>
			{#each segments as segment, sg}
				<rect
					bind:this={segmentRectElements[st][sg]}
					x={x + segmentXs[sg]}
					y={100 - segmentYs[sg] * coinThick - baseY}
					width={coinWidth}
					height={segment * coinThick + 0.3}
					fill="url(#coin-stack)"
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
		transform-origin: 50% 50%;
		will-change: transform;
	}
</style>
