<script lang="ts">
	export let score: number

	let lastScore = 0
	let scoreTickTime = 0
	$: if (score) {
		scoreTickTime = Math.min(2000, Math.max(300, (score - lastScore) * 10))
		lastScore = score
	}
</script>

<div class="score nunito">
	<span
		class="points"
		class:mini={score.toString().length > 7}
		class:micro={score.toString().length > 8}
		style="--totalScore: {score}; transition: --totalScore {scoreTickTime}ms;"
	/> pts
</div>

<style>
	@property --totalScore {
		syntax: '<integer>';
		initial-value: 0;
		inherits: false;
	}

	.score {
		font-size: 26px;
		line-height: 37px;
		text-align: right;
		white-space: nowrap;
		position: relative;
		background: #841784df;
		border-radius: 12px;
		padding: 4px 6px 0;
	}
	.score .points {
		font-size: 38px;
		transition: --totalScore 1500ms;
		counter-reset: totalScore var(--totalScore);
	}
	.score .points::after {
		content: counter(totalScore);
	}
	.score .points.mini {
		font-size: 35px;
	}
	.score .points.micro {
		font-size: 31px;
	}
</style>
