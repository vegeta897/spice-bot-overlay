<script lang="ts">
	export let train: any

	$: lastGrace = train.graces[train.graces.length - 1]
	$: totalScore = lastGrace?.totalScore + lastGrace?.comboScore || 0
	$: scoreDelta = Math.max(300, (lastGrace?.delta || 0) * 10)
</script>

<div class="score nunito">
	<span
		class="points"
		style="--totalScore: {totalScore}; transition: --totalScore {Math.min(
			2000,
			scoreDelta
		)}ms;"
	/> pts
</div>

<style>
	@property --totalScore {
		syntax: '<integer>';
		initial-value: 0;
		inherits: false;
	}

	.score {
		font-size: 36px;
		position: relative;
		text-shadow: 0 0 3px #000, 0 0 3px #000, 0 0 3px #000;
	}
	.score .points {
		font-size: 56px;
		transition: --totalScore 1500ms;
		counter-reset: totalScore var(--totalScore);
	}
	.score .points::after {
		content: counter(totalScore);
	}
</style>
