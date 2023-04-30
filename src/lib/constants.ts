export const TRAIN = {
	engineWidth: 96, // Padding included
	engineWidthGold: 106,
	carWidth: 81,
	carWidthGold: 91,
	cabooseWidth: 91,
	speed: 150, // Pixels per second
	speedAddPerCombo: 1.5, // Pixels per second added per train length
	minLength: 5,
	departDelay: 3 * 1000, // Milliseconds before train departs
	endInfoDuration: 5 * 1000, // Milliseconds until info panel disappears
	endInfoLengthPerSecond: 30, // 1 second added to end info panel per this train length
}

export const SCREEN = {
	width: 1920,
	height: 1080,
}

export const GRADIENTS = {
	gold: '<stop offset="0" stop-color="#fef9b5" /><stop offset="0.28" stop-color="#be9c38" /><stop offset="0.48" stop-color="#eace50" /><stop offset="0.67" stop-color="#fef9b5" /><stop offset="0.85" stop-color="#be9c38" /><stop offset="1" stop-color="#eace50" />',
}

export const SPARKLE_COORDS: Record<string, [number, number][]> = {
	engine: [
		[80, 130],
		[80, 180],
		[190, 130],
		[190, 180],
		[340, 110],
		[340, 190],
	],
	car: [
		[55, 40],
		[55, 85],
		[305, 40],
		[305, 85],
		[180, 20],
		[180, 105],
	],
}
