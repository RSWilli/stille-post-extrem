import { derived, get } from "svelte/store";
import { socket } from "../com/socket";
import { Map } from "immutable";
import { customStore } from "../lib/helper";

export const myID = customStore<string | undefined>(undefined, store => {
    socket.on("connect", () => {
        store.set(socket.id)
    })
})

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
    socket.on("disconnect", () => {
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
    socket.on("disconnect", () => {
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
    socket.on("disconnect", () => {
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
    socket.on("disconnect", () => {
        store.set(false)
    })
})

const users = customStore(Map<string, string>(), store => {

    let id: string

    myID.subscribe(v => id = v!)

    socket.on("joined", (username: string) => {
        store.update(list => list.set(id, username))
    })
    socket.on("info", (username: string, sid: string) => {
        store.update(list => list.set(sid, username))
    })
    socket.on("join", (username: string, sid: string) => {
        store.update(list => list.set(sid, username))

        socket.emit("info", get(store).get(id), id)
    })
    socket.on("leave", (sid: string) => {
        store.update(list => list.delete(sid))
    })
    socket.on("quit", () => {
        store.set(Map())
    })
    socket.on("disconnect", () => {
        store.set(Map())
    })
})

interface User {
    id: string
    name: string
    index: number
    prev: () => string
}

export const userList = derived(users, v => {
    const ordered = Array.from(v.keys()).sort()

    const reverseIndex = Map(ordered.map((id, i) => [id, i]))

    return Array.from(v.entries()).map<User>(([id, name]) => {
        const index = reverseIndex.get(id)!
        return {
            id,
            name,
            index,
            prev: () => ordered[(index - 1) % ordered.length]
        }
    })
})

export const userMap = derived(userList, v => {
    return Map(v.map(user => [user.id, user]))
})
