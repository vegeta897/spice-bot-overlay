<script lang="ts">
	import { randomElement } from '../../lib/util'
	import Redeem from './Redeem.svelte'
	export let username: string
	export let color: string
	export let text: string
	export let time: string
	export let highlight = false
	export let grace = false
	export let redeem = false
	export let bits: number | false = false
	export let subs: number | false = false

	const subType = randomElement(['at Tier 1.', 'with Prime.'])
</script>

<div class="message" class:redeem class:subs>
	{#if redeem || subs}
		<p class="faded">
			{#if grace}
				{username} redeemed GRACE
			{:else if highlight}
				Redeemed Highlight My Message
			{:else if subs}
				{username}
				{#if subs === 1}subscribed {subType}{:else}gifted {subs} subs!{/if}
			{/if}
			{#if redeem}<Redeem />{grace ? 250 : 100}{/if}
		</p>
	{/if}
	{#if !grace && !subs}
		<p>
			<span class="time faded">{time}</span><strong style:color>{username}</strong><span
				>:
			</span>
			{#if bits}
				<span class="cheer-icon" class:cheer-1000={bits >= 1000} />
				<span class="bits" class:cheer-1000={bits >= 1000}>{bits}</span>
			{:else}
				<span class:highlight>
					{#if subs}
						{#if subs > 1}gifted {subs}!{:else}subscribed!{/if}
					{:else}
						{text}
					{/if}
				</span>
			{/if}
		</p>
	{/if}
</div>

<style>
	.message {
		margin: 4px 2px;
		padding: 2px 0;
		border-left: 4px solid transparent;
	}
	.redeem {
		border-left-color: #adadb8;
	}
	.subs {
		border-left-color: #6441a4;
	}

	p {
		margin: 0;
		padding: 2px 12px;
		font-size: 12px;
		line-height: 16px;
	}

	.faded {
		color: #adadb8;
	}

	.time {
		margin-right: 7px;
	}

	strong {
		font-weight: 700;
	}

	.highlight {
		background: #755ebc;
		border: 3px solid #755ebc;
		color: #fff;
	}

	.bits {
		font-weight: 700;
		color: #9346f2;
	}
	.cheer-1000 {
		color: #47d7b3;
	}
	.cheer-icon {
		display: inline-block;
		width: 18px;
		height: 18px;
		position: relative;
		margin: -3px 0;
		top: 1px;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABblBMVEUAAAC9Yv+HF/vOqP/Jo/++aP+pfvOheOjDhv/Gl/9CHnMfEDiIF/2ugv7TpP+JF/qvg/y+af9/Fuy8Zf/SpP/Adf/Adv+SbdLBff/Op/99XblDC4ByVqXGnP8AAADGlv/Kiv+cWfm9ZP/SpP++Z//Upf+HF/nSpP/Qof+vhfeEF/OCFPJ8FeZ/FunRpP+DGO6+bf+AFux/FurQpf/Qpf+/cf91FNhrEsfQpf+Oasu/c/9mEsBkEbxwE9PAdP9sE8vBgP91FNvPpv/DiP/Opv99XrdtEc2CYr8/CnttEsxTDZtjJ6bBfv9dELDCh/9hSZJYQoPDh/9nEcVlEb/Upv+FFvvTpP+vhf++Y/+rgP+sgf/To/+whv+GGPy6Xv++Yv+9Yf/Qof/VqP/UpP+ugv/Rof+xiP/DdP/Aaf+WS/2GF/uEEvvSnv/Olv/GgP+odf6iZ/6JF/6QOP2GHvvMjf/Jhf+cW/2GF/2LLfyIJPssSC4cAAAAVHRSTlMA+/ooDOTetkMQCgf9+/j19NzWy8CkmHpVUj8xIRULBffw7uzq5ubk5ODe2M3Kyb+2taOSjIuLiYeDgH98dm1rXllWUE1KSEREPzkuLSEgHhwbFBG2P57tAAABjklEQVQ4y53SZ1PCQBgEYEAFpYkgAoq99957751cDpKQQCJVafZ/7x3HECaQZMadfHzm3ckmhv/lwq9vrPOeNl10Zooe6Jk+Nxdt6dVBu3Yuyq9qm6cpiovCkTtNtF7EiPdqmZ52CiNobNVASxxBcKFf1VyZKIrKYMQfq77+LIcQV0Ydaose4kMEQeOeygdxZ2QEVRbdLlI4GYKErkbmdqxssumcUFZDNw3QGofN+1ci9JHiEeK9jXeksj95lgXx16QAGy1qW/xGKC2xNAtCoVAO8lDwNCvQpQlVFViaJij+lhKg0a84NMNlS/kETRAKrlQuum+n0lgQRPIpCFu15nn6t5BQIFzZ8liDdkphllYgpJhkzaLXgzQyMpIzIM/QPSlFqpFiQBSBCFBEMHoinwpa6HA1MQaA8sOInU2G2my6IhUTeQEkjHNZuea5OVJBMYaY4UD9P3xvkeRLqAtX1cfqc8nIuUKq6nNqlkgdM35kUM2DxYEQAHOoSj02nwNd2lCpkoc1TwQMugnWV/0B2uOdAAH1d3AAAAAASUVORK5CYII=);
		background-size: contain;
	}
	.cheer-icon.cheer-1000 {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABmFBMVEUAAAAtsZ4D6LARk4kFaVoIFA8SrJQSq5RWrKEJkYYTmo8Hr5cRlokGjYAMzJwMkIMCjHsMwZQ0pphH3bQBXFEAcWFPzLcHo5II57AClosCtpcNtJsCyKsCpY4S1rgR16cetZ0CrZQktZ4RlIkCoYgh1acOkoQjppgCfndEwbMElocv574tp51OsKc6waAo6cs3raAp3q4BenBC6r0ClH88nJIfqJI0xKoIpY9HvaoDwJECgXNBrqA24bMhl4UkkYUCjXgbyZoItYk1q5gDxZYSwZQAW1RwwLoBODQoh36Mz8oBY1wAAAACgnBAwK0AAgVWyL0B+NkB5aYB+N4B5qgCk4cBrJQD5K0B56sCopECoJEB+eAB6KwCqpIB+doB9tcD6rED5KwCppMBkIYB+NsCyawB6KgBy50BuZYCrpUCpZQCq5MB9NIBv5gBlYkCkocC78gC7LwD57QC0rQCz7ICzK8CxqoB6akB46cB26QB1qQB0J4BxpoBw5oEp5YDqZQC7cID7MAD5K4Cw6YFu5oDs5kCsJcBtJMUuBZQAAAAUXRSTlMABP3jCAbn5SD08u3onp2ck46NbicUC/z49fHw7enl5OTj0dG4s7Cuq6ampaCfn56YlpSOjYyLioiGhYWEgnx8fHt7d3NnNjQtJSQiHRsXFglpJ6RuAAABvElEQVQ4y7XTZ1PiQBzH8b0czXrenXr97L333nsXstmQGAgSQIqIvff6tt3doIQQZHzgN08/88t/JhPwgX0fNmc0Uz+9I5nMJMN7LwczvIvhea8QHnjLjHl4goTwt7Tk0zgx615BxCrd9UMMMbsPooBZgSEx93swYbZZaeMKM6F11QB9ZbC59rGsEx5fiKLw40sKMXV4+PWdzTWWIHh0EhTFyzyT7ma8s4sJQRIknSJRqDMnmTbP7TYVdIkUgPi0es2WKZ+58WGSQLTjaLi6+BXl78hxot70UuDkvia+VdyAj9EkwURHp5VFFLX4WG0+suRwQPKQqijqkd12bU5HUs0UFf6V30C/pwGtwC+nRcFaoFb07y4despaAPF6I4eGCAZjiQ9o++M6lA1QUMmaAa/1oYg/BQWiMaUJJFouRS6/DsGowmXbgKbuEN5ya1HgguO28oC2xZwQch2oSKI75wrH/ZoFSY2GEIocuCmihsND7SC5pTKEkGufKCc2GzGMcueArs7HFyVhw+GURqBvJQcRtee2O+EZR8qeBylNhFRll1Sz1QVSs5VbLFaL1fq/JPczqaLQ8C/XBd7XM5Yz01SG7BqWAAAAAElFTkSuQmCC);
		background-size: contain;
	}
</style>
