<script lang="ts">
    import type { RoundData } from "./com/actions";
    import {
        leaveRoom,
        sendData,
        shuffleLobby,
        startGame,
    } from "./com/actions";
    import Draw from "./Draw.svelte";
    import { currentData, roundTimer } from "./store/game";

    import {
        currentRoom,
        isGameStarted,
        isMaster,
        myColor,
        userList,
    } from "./store/main";

    let getData: () => string;

    let data: RoundData | undefined = undefined;

    currentData.subscribe((d) => (data = d));

    let word: string;

    roundTimer.subscribe((time) => {
        if (time == 0 && data) {
            if (data.type == "text") {
                const img = getData();
                sendData({
                    type: "draw",
                    data: img,
                });
            } else if (data.type == "draw") {
                sendData({
                    data: word,
                    type: "text",
                });
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
        {#if !$isGameStarted && $isMaster}
            <button class="button is-primary" on:click={() => shuffleLobby()}
                >Shuffle Players</button
            >
        {/if}
        <ul>
            {#each $userList as user}
                <li style="color: {user.color};">
                    {user.username}
                </li>
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
        {#if data != undefined}
            {#if data.type == "text"}
                <div class="draw">
                    <Draw bind:getImageData={getData} color={myColor} />
                </div>
                <span class="write">{data.data}</span>
            {:else}
                <input type="text" class="write" bind:value={word} />
                <img src={data.data} alt="Describe this!" />
            {/if}
        {:else}
            {$currentData}
        {/if}
        <span class="countdown is-3">{$roundTimer}</span>
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

    .draw {
        grid-area: draw;
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
