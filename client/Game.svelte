<script lang="ts">
    import { leaveRoom, socket, startGame } from "./com/socket";
    import { colors } from "./data/colors";
    import Draw from "./Draw.svelte";
    import { roundMode, roundTimer, word } from "./store/game";

    import {
        currentRoom,
        isGameStarted,
        isMaster,
        userList,
        userMap,
    } from "./store/main";

    let getData: () => string;

    let mycolor = "red";

    const mode = $roundMode;

    userMap.subscribe((users) => {
        mycolor = colors[users.get(socket.id)?.index ?? 0];
    });

    roundTimer.subscribe((time) => {
        if (time == 0) {
            if (mode == "draw") {
                const img = getData();
            } else if (mode == "text") {
                //TODO
            }
        }
    });
</script>

<div id="container">
    <h1 class="title is-1 has-text-centered">Stille Post Extrem</h1>
    <span class="room is-size-5 is-align-self-center"
        >Room ID: {$currentRoom}</span
    >
    <button
        on:click={() => leaveRoom()}
        class="button leave is-small is-align-self-center"
    >
        <span class="icon is-small">
            <i class="fas fa-sign-out-alt" />
        </span>
    </button>
    <aside class="content">
        <ul>
            {#each $userList as user}
                <li style="color: {colors[user.index]};">{user.name}</li>
            {/each}
        </ul>
    </aside>
    {#if !$isGameStarted}
        <main
            class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column"
        >
            <h1>No Game Started</h1>
            {#if $isMaster}
                <button
                    on:click={() => startGame()}
                    class="button is-success my-1">Start Game</button
                >
            {/if}
        </main>
    {:else}
        <Draw bind:getImageData={getData} color={mycolor} className="draw" />
        <span class="countdown is-3">{$roundTimer}</span>
        {#if mode == "draw"}
            <span class="write is-2">{$word.toUpperCase()}</span>
        {/if}
    {/if}
</div>

<style lang="scss">
    #container {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 3rem 2rem 1fr;
        grid-template-columns: auto 1fr 80px;
        grid-template-areas:
            "room header leave"
            "userlist write countdown"
            "userlist draw draw";

        & :global(.draw) {
            grid-area: draw;
        }
    }

    aside {
        grid-area: userlist;
        border-right: 1px solid #ccc;
    }
    h1 {
        grid-area: header;
    }
    .room {
        grid-area: room;
    }
    .leave {
        grid-area: leave;
    }

    main {
        grid-area: write / write / draw / draw;
    }

    .countdown {
        grid-area: countdown;
        place-self: center;
    }

    .write {
        grid-area: write;
    }
</style>
