import Color from 'color'
import { clamp } from './util'

const gemColorCache: Map<
	string,
	{
		baseColor: string
		brighterColor: string
		brightestColor: string
		darkerColor: string
		darkestColor: string
	}
> = new Map()

export function getGemColors(color: string) {
	const cached = gemColorCache.get(color)
	if (cached) return cached
	const colorObject = Color(color)
	const baseColor = colorObject.lightness(clamp(colorObject.lightness(), 40, 85)).hex()
	const brighterColor = colorObject.lightness(75).rotate(10).hex()
	const brightestColor = colorObject.lightness(92).rotate(20).hex()
	const darkerColor = colorObject.lightness(55).rotate(-10).hex()
	const darkestColor = colorObject.lightness(30).rotate(-20).hex()
	const gemColors = {
		baseColor,
		brighterColor,
		brightestColor,
		darkerColor,
		darkestColor,
	}
	gemColorCache.set(color, gemColors)
	return gemColors
}
