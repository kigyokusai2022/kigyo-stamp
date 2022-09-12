<script lang="ts">
	import StampBox from "./components/StampBox.svelte";
	import {authenticated, stamps} from "./main";
	import Logo from "./components/Logo.svelte";
</script>

<style>
	.background {
		position: absolute;
		top: 0;

		height: 100vh;
		width: 100vw;

		background-image: url("../img/background.jpg");
		background-size: cover;
		background-position: center;
	}

	.background-white-effect {
		position: absolute;
		top: 0;

		height: 100vh;
		width: 100vw;

		background-color: white;
		opacity: 0.2;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.box {
		position: absolute;

		box-sizing: border-box;

		height: 100vh;
		width: 100vw;

		padding: 30px;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.stamps {
		display: grid;
		align-items: center;
		justify-content: center;
	}

	@media screen and (max-aspect-ratio: 2/3) {
		.stamps {
			height: auto;
			width: 60vw;
			grid-template-rows: 1fr 1fr 1fr;
			grid-template-columns: 1fr 1fr;
		}
	}

	@media screen and (min-aspect-ratio: 2/3) {
		.stamps {
			height: auto;
			width: 50vw;
			grid-template-rows: 1fr 1fr;
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
</style>
<div class="background"></div>
<div class="background-white-effect"></div>
{#if $authenticated}
	<div class="box">
		<p>各参加団体にあるQRコードをカメラアプリで読み込んでスタンプを集めよう！<br>スタンプをすべて回収したら、一号館1Fエントランスの受付で、景品と交換しよう！</p>
		<div class="stamps">
			<Logo/>
			{#each $stamps as stamp}
				<StampBox stampId={stamp.id} stampName={stamp.name}/>
			{/each}
		</div>
	</div>
{:else}
	<div class="loading">
		<h1>読み込み中...</h1>
	</div>
{/if}