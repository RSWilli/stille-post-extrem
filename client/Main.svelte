<script lang="ts">
    import { createRoom, joinRoom } from "./com/socket";
    import {} from "svelma";

    let username: string;
    let room: string;
</script>

<div class="box">
    <input bind:value={username} type="text" placeholder="Username" />
    <div>
        <button on:click={() => createRoom(username)}>Create Room</button>
    </div>
    <div>or</div>
    <div>
        <input bind:value={room} type="text" placeholder="Room ID" />
        <button on:click={() => joinRoom(username, room)}>Join Room</button>
    </div>
</div>

<style lang="scss">
</style>
