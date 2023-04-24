export const TRAIN = {
	engineWidth: 96, // Padding included
	carWidth: 81,
	speed: 85, // Pixels per second
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
