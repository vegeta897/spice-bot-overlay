export const TRAIN = {
	engineWidth: 96, // Padding included TODO: Increase size when depot site launches
	engineWidthGold: 106,
	carWidth: 81,
	carWidthGold: 91,
	cabooseWidth: 91,
	speed: 80, // Pixels per second
	speedAddPerCombo: 1.2, // Pixels per second added per train length
	minLength: 5,
	departDelay: 3 * 1000, // Milliseconds before train departs
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
