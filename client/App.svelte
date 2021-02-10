<script lang="ts">
	import "bulma/css/bulma.css";
	import "./com/socket";
	import Game from "./Game.svelte";
	import Main from "./Main.svelte";
	import { isInLobby } from "./store/main";
</script>

<h1 class="title is-1 has-text-centered">Stille Post Extrem</h1>

{#if $isInLobby}
	<Game />
{:else}
	<Main />
{/if}
