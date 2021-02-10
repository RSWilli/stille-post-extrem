<script lang="ts">
    import { leaveRoom } from "./com/socket";

    import { currentRoom, userList } from "./store/main";
</script>

<span>Started Game</span>

<span>{$currentRoom}</span>

{#each $userList as user}
    <span>{user}</span>
{/each}

<button on:click={() => leaveRoom()}>Leave Room</button>
