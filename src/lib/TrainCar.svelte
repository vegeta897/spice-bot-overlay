<script lang="ts">
	export let color: string

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
