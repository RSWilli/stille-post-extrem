<script lang="ts">
	import "./com/socket";
	import Game from "./Game.svelte";
	import Main from "./Main.svelte";
	import { isInLobby } from "./store/main";
</script>

<main>
	{#if $isInLobby}
		<Game />
	{:else}
		<Main />
	{/if}
</main>
