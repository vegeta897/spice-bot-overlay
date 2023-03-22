<script lang="ts">
	const colors = [
		'#aa2233',
		'#aa226d',
		'#aa22a6',
		'#6f22aa',
		'#3622aa',
		'#2246aa',
		'#2271aa',
		'#22aa9f',
		'#22aa6d',
		'#22aa30',
		'#62aa22',
		'#9aaa22',
		'#aa7622',
		'#aa3f22',
	]
	const color = colors[Math.floor(Math.random() * colors.length)]

	// TODO: Listen for train updates, trigger an animation based on this car's
	// distance from end, to simulate a diminishing "impulse" wave through the train

	// Draw with path data, and give each vertex random XY variation seeded by user ID
	// Or just variable width, height, skew, wheel size, wheel spacing, etc
</script>

<svg viewBox="0 0 200 150" width="100" height="75">
	<circle cx="50" cy="130" r="20" fill="#777" />
	<circle cx="150" cy="130" r="20" fill="#777" />
	<rect x="10" y="110" width="180" height="15" fill="#475062" />
	<path d="M20 110 h160 l20 -95 h-200 l20 95 Z" fill={color} />
	<rect x="75" y="0" width="50" height="15" fill="#475062" />
</svg>

<style>
	svg {
		display: inline-block;
		/* background-color: rgba(255, 255, 255, 0.1); */
	}
</style>
