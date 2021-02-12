<script lang="ts">
	import "@fortawesome/fontawesome-free/css/all.css";
	import "bulma/css/bulma.css";
	import "./com/socket";
	import Game from "./Game.svelte";
	import Main from "./Main.svelte";
	import { isInLobby } from "./store/main";
</script>

{#if $isInLobby}
	<Game />
{:else}
	<Main />
{/if}
