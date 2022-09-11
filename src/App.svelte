<script lang="ts">
	import StampBox from "./components/StampBox.svelte";
	import {authenticated, stamps} from "./main";
	import Logo from "./components/Logo.svelte";
</script>

<style>
	.background {
		height: 100vh;
		width: 100vw;

		position: absolute;

		background-image: url("../img/background.jpg");
		background-size: cover;
		background-position: center;
	}
	.stamps {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);

		padding: 20px;
		margin: 0;

		display: grid;
		align-items: center;
		justify-content: center;

		background-color: white;

		border: solid yellow 20px;

		filter: drop-shadow(0 0 10px gray);
	}

	@media screen and (max-aspect-ratio: 1/1) {
		.stamps {
			height: auto;
			width: min(60vw,50vh);
			grid-template-rows: 1fr 1fr 1fr;
			grid-template-columns: 1fr 1fr;
		}
	}

	@media screen and (min-aspect-ratio: 1/1) {
		.stamps {
			height: auto;
			width: auto;
			grid-template-rows: 1fr 1fr;
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
</style>
{#if $authenticated}
	<div class="background"></div>
	<div class="stamps">
		<Logo/>
		{#each $stamps as stamp}
			<StampBox stampId={stamp.id} stampName={stamp.name}/>
		{/each}
	</div>
{:else}
	<p>読み込み中...</p>
{/if}