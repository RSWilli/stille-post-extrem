<script lang="ts">
    import { createRoom, joinRoom } from "./com/socket";
    import { initialSocketListenerSetup } from "./store/main";

    let username: string;
    let room: string;

    initialSocketListenerSetup.subscribe(() => {
        // subscribe for socket listeners to be setup
    });
</script>

<div>
    <input bind:value={username} type="text" placeholder="Username" />
    <div>
        <button on:click={createRoom}>Create Room</button>
    </div>
    <div>or</div>
    <div>
        <input bind:value={room} type="text" placeholder="Room ID" />
        <button on:click={() => joinRoom(username, room)}>Join Room</button>
    </div>
</div>
