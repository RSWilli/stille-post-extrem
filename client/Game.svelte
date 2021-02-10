<script lang="ts">
    import { leaveRoom } from "./com/socket";

    import { currentRoom, isMaster, userList } from "./store/main";
</script>

<span>Started Game</span>

<span>{$currentRoom}</span>
<span>{$isMaster}</span>

<span>{$userList}</span>

<button on:click={() => leaveRoom()}>Leave Room</button>
