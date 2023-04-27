<script lang="ts">
	import { randomIntRange } from '../../lib/util'

	export let reverse: boolean

	const stackGroupElements: SVGGElement[] = []
	const segmentRectElements: SVGRectElement[][] = []

	const stacks = [
		{ x: 25, segments: [5, 1, 1] },
		{ x: 8, segments: [4, 1] },
		{ x: 67, segments: [3, 1] },
		{ x: 50, segments: [5, 1, 1, 1] },
		{ x: 30, segments: [5, 1] },
	].map(({ x, segments }) => {
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
		return { x, segments, segmentYs, segmentXs }
	})

	for (let i = 0; i < stacks.length; i++) {
		segmentRectElements.push([])
	}

	const timeScale = 1

	export function jumble(force: number) {
		for (let i = 0; i < stacks.length; i++) {
			const stack = stacks[i]
			const stackGroupElement = stackGroupElements[i]
			const shimmy = Math.round((stack.x / 6) * force)
			const height = Math.round(20 * force)
			const rotate = Math.round(height / 3)
			const stackDelay = (70 - stack.x) * 1 * timeScale
			const duration = (200 + force * 200) * timeScale
			stackGroupElement.animate(
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
				const segmentRectElement = segmentRectElements[i][s]
				const segmentJumpHeight = Math.round(s ** 2 * 2 * force)
				const segmentRotation = Math.round(segmentJumpHeight * 0.3)
				const segmentShiftX = Math.round((s - 1) ** 2 * force)
				segmentRectElement.animate(
					[
						{ transform: 'translate(0,0) rotate(0)' },
						{
							transform: `translate(${segmentShiftX / 2}px,0) rotate(${
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
					{ duration: duration, delay: stackDelay }
				)
			}
		}
	}
</script>

<svg viewBox="0 0 100 100" width="91" height="91" class:reverse>
	{#each stacks as { x, segments, segmentYs, segmentXs }, st}
		<g bind:this={stackGroupElements[st]}>
			{#each segments as segment, sg}
				<rect
					bind:this={segmentRectElements[st][sg]}
					x={x + segmentXs[sg]}
					y={100 - segmentYs[sg] * 8}
					width="25"
					height={segment * 8 + 0.3}
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
