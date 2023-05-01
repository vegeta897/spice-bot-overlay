const timeScale = 1

export function carHop(
	carSVG: SVGElement,
	delay: number,
	force: number,
	reverse: boolean
) {
	if (!carSVG) return
	const flipX = reverse ? -1 : 1
	const jump = Math.round(force * -20)
	const halfJump = Math.round(jump / 2)
	const shimmy = Math.round(force * -8) * flipX
	const tilt = Math.round(force * 10) * flipX
	const halfTilt = Math.round(tilt / 1.5)
	delay *= timeScale
	carSVG.animate(
		[
			delay === 0
				? {
						transform: `translateX(${reverse ? '' : '-'}20px) scaleX(0.5)`,
						easing: 'ease-out',
				  }
				: {},
			{
				transform: `translate(${shimmy}px,${halfJump}px) rotate(${tilt * -1}deg)`,
				easing: 'ease-out',
			},
			{
				transform: `translate(0,${jump}px) rotate(0)`,
				easing: 'ease-in',
			},
			{
				transform: `translate(0,${halfJump}px) rotate(${halfTilt}deg)`,
			},
			{},
		],
		{ delay, duration: (200 + force * 250) * timeScale }
	)
}
