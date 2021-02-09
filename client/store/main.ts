import { derived, readable } from "svelte/store";
import { socket } from "../com/socket";
import { Map } from "immutable";
import { updatable } from "../lib/helper";

export const isMaster = readable<boolean>(false, set => {
    socket.on("master", (id: string) => {
        console.log(id);
        set(true)
    })
    socket.on("gameend", () => {
        set(false)
    })
})

export const currentRoom = readable<string | undefined>(undefined, set => {
    socket.on("master", (id: string) => {
        set(id)
    })
    socket.on("leave", () => {
        set(undefined)
    })
})

export const isInLobby = readable<boolean>(false, set => {
    socket.on("master", () => {
        set(true)
    })
    socket.on("leave", () => {
        set(false)
    })
})

export const isGameStarted = readable<boolean>(false, set => {
    socket.on("gamestart", () => {
        set(true)
    })
    socket.on("gameend", () => {
        set(false)
    })
})

export const users = updatable<Map<string, string>>(Map(), update => {
    socket.on("join", (username: string, sid: string) => {
        update(list => list.set(sid, username))
    })
})

export const userList = derived(users, v => Array.from(v.values()))

export const initialSocketListenerSetup = derived([
    isMaster,
    isGameStarted,
    currentRoom,
    isInLobby
], () => "")