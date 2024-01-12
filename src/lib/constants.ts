const carMargin = 4
const doubleMargin = carMargin * 2
const engineWidth = 120 // from 450
const engineWidthGold = 133 // from 500
const carWidth = 100 // from 375
const carWidthGold = 113 // from 425
const cabooseWidth = 113 // from 425

export const TRAIN = {
	carMargin,
	engineWidth,
	engineWidthGold,
	carWidth,
	carWidthGold,
	cabooseWidth,
	engineWidthPlusMargin: engineWidth + doubleMargin,
	engineWidthGoldPlusMargin: engineWidthGold + doubleMargin,
	carWidthPlusMargin: carWidth + doubleMargin,
	carWidthGoldPlusMargin: carWidthGold + doubleMargin,
	cabooseWidthPlusMargin: cabooseWidth + doubleMargin,
	speed: 80, // Pixels per second
	speedAddPerCombo: 1.2, // Pixels per second added per train length
	minLength: 5,
	departDelay: 2 * 1000, // Milliseconds before train departs
	endInfoDuration: 5 * 1000, // Milliseconds until info panel disappears
	endInfoLengthPerSecond: 30, // 1 second added to end info panel per this train length
}

export const SCREEN = {
	width: 1920,
	height: 1080,
}

export const COLORS = {
	smokeyRainbow: [
		'#D6A4A9',
		'#CEABB4',
		'#C2B8C3',
		'#BAC3C3',
		'#B5CDB4',
		'#ADD3B3',
		'#A0CFC8',
		'#9CCAD6',
		'#ADC3D0',
		'#BDBCCA',
		'#C8B1BC',
	],
}

export const GRADIENTS = {
	gold: '<stop offset="0" stop-color="#fffab1" /><stop offset="0.28" stop-color="#cda42a" /><stop offset="0.48" stop-color="#f8d740" /><stop offset="0.67" stop-color="#fffab1" /><stop offset="0.85" stop-color="#cda42a" /><stop offset="1" stop-color="#f8d740" />',
}

export const SPARKLE_COORDS: Record<string, [number, number][]> = {
	// engine: [
	// 	[80, 130],
	// 	[80, 180],
	// 	[190, 130],
	// 	[190, 180],
	// 	[340, 110],
	// 	[340, 190],
	// ],
	car: [
		[50, 40],
		[50, 85],
		[310, 40],
		[310, 85],
		[180, 35],
		[180, 120],
	],
}
