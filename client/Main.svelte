<script lang="ts">
    import { createRoom, joinRoom } from "./com/socket";

    let username: string;
    let room: string;

    const joinRoomHandler = () => {
        if (username != "" && room != "") {
            joinRoom(username, room);
        }
    };

    const createRoomHandler = () => {
        if (username != "") {
            createRoom(username);
        }
    };
</script>

<h1 class="title is-1 has-text-centered">Stille Post Extrem</h1>

<div class="box wrapper">
    <div class="field">
        <label for="username" class="label">Username</label>
        <div class="control">
            <input
                id="username"
                class="input"
                type="text"
                placeholder="Username"
                bind:value={username}
            />
        </div>
    </div>
    <label for="roomid" class="label">Room ID</label>
    <div class="field has-addons">
        <div class="control is-flex-grow-1">
            <input
                id="roomid"
                class="input"
                type="text"
                placeholder="Room ID"
                bind:value={room}
            />
        </div>
        <div class="control">
            <button on:click={joinRoomHandler} class="button is-link"
                >Join Room</button
            >
        </div>
    </div>
    <button class="button is-centered is-primary" on:click={createRoomHandler}>
        Create Room
    </button>
</div>

<style lang="scss">
    .wrapper {
        max-width: 30vw;
        margin: 20vh auto;
    }
</style>
