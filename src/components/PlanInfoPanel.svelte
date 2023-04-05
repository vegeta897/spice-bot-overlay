<script lang="ts">
	import TrainTrack from './TrainTrack.svelte'
</script>

<section class="nunito">
	<TrainTrack />
	<div class="rail-content">GRACE STATS</div>
	<div class="end" />
</section>

<style>
	section {
		width: 500px;
		height: 230px;
		padding: 12px;
		box-sizing: border-box;
		position: absolute;
		right: 0;
		bottom: 80px;
		text-align: center;
		opacity: 0.8;
	}

	.rail-content {
		margin: 18px auto 0;
		width: 430px;
		height: 98px;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
		border-radius: 20px;
		background: #5029c4d0;
		position: relative;
		font-size: 3rem;
	}

	.end {
		background: #df256da3;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		width: 200px;
		height: 60px;
		margin: 14px auto 0;
		padding: 6px 22px;
		font-size: 2rem;
	}
</style>
