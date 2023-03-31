<script lang="ts">
	export let train: any

	$: lastGrace = train.graces[train.graces.length - 1]
	$: totalScore = lastGrace?.totalScore + lastGrace?.comboScore || 0
	$: scoreDelta = Math.max(300, (lastGrace?.delta || 0) * 10)
</script>

<div class="score nunito">
	<span
		class="points"
		class:mini={totalScore.toString().length > 7}
		class:micro={totalScore.toString().length > 8}
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
		font-size: 26px;
		line-height: 37px;
		text-align: right;
		white-space: nowrap;
		position: relative;
		background: #841784cf;
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
