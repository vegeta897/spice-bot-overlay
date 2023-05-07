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

export function bounce(element: HTMLElement, force: number, delay = 0) {
	element?.animate(
		[
			{ easing: 'ease-out' },
			{
				transform: `scale(${100 + force}%)`,
				easing: 'cubic-bezier(0.5, 0, 0.55, 1.65)',
				offset: 0.3,
			},
			{ transform: 'scale(100%)' },
		],
		{ delay, duration: 300 }
	)
}

const growKeyframes: Keyframe[] = [
	{ easing: 'ease-in' },
	{ offset: 0.67, transform: 'scale(110%)', easing: 'ease-out' },
	{ offset: 0.76, transform: 'scale(111%) translateX(-1px)', easing: 'ease-out' },
	{ offset: 0.83, transform: 'scale(111%) translateX(1px)', easing: 'ease-out' },
	{ offset: 0.88, transform: 'scale(112%) translateX(-2px)', easing: 'ease-out' },
	{ offset: 0.92, transform: 'scale(112%) translateX(2px)', easing: 'ease-out' },
	{ offset: 0.95, transform: 'scale(113%) translateX(-3px)', easing: 'ease-out' },
	{ offset: 0.97, transform: 'scale(113%) translateX(3px)', easing: 'ease-out' },
	{ offset: 0.99, transform: 'scale(113%) translateX(-4px)', easing: 'ease-out' },
	{ offset: 1, transform: 'scale(113%)' },
]

export function grow(element: HTMLElement, duration: number) {
	element?.animate(growKeyframes, duration)
}
