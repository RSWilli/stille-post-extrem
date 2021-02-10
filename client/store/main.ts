import { derived, get } from "svelte/store";
import { socket } from "../com/socket";
import { Map } from "immutable";
import { customStore } from "../lib/helper";

export const isMaster = customStore(false, store => {
    socket.on("master", () => {
        store.set(true)
    })
    socket.on("gameend", () => {
        store.set(false)
    })
    socket.on("quit", () => {
        store.set(false)
    })
})

export const currentRoom = customStore<string | undefined>(undefined, (store) => {

    socket.on("master", (id: string) => {
        store.set(id)
    })
    socket.on("joined", (username: string, roomid: string) => {
        store.set(roomid)
    })
    socket.on("quit", () => {
        store.set(undefined)
    })
})

export const isInLobby = customStore(false, store => {
    socket.on("master", () => {
        store.set(true)
    })
    socket.on("joined", () => {
        store.set(true)
    })
    socket.on("quit", () => {
        store.set(false)
    })
})

export const isGameStarted = customStore(false, store => {
    socket.on("gamestart", () => {
        store.set(true)
    })
    socket.on("gameend", () => {
        store.set(false)
    })
    socket.on("quit", () => {
        store.set(false)
    })
})

export const users = customStore(Map<string, string>(), store => {

    socket.on("joined", (username: string) => {
        store.update(list => list.set(socket.id, username))
    })
    socket.on("info", (username: string, sid: string) => {
        store.update(list => list.set(sid, username))
    })
    socket.on("join", (username: string, sid: string) => {
        store.update(list => list.set(sid, username))

        socket.emit("info", get(store).get(socket.id), socket.id)
    })
    socket.on("leave", (sid: string) => {
        store.update(list => list.delete(sid))
    })
    socket.on("quit", () => {
        store.set(Map())
    })
})

export const userList = derived(users, v => Array.from(v.values()))