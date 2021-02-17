import { derived, get, writable } from "svelte/store";
import { sendInfo, User } from "../com/actions";
import { Map } from "immutable";
import { customStore, customWritableStore } from "../lib/helper";
import sortBy from "lodash.sortby";
import { socket } from "../com/socket";
import { colors } from "../data/colors";

export const myID = customStore<string | undefined>(undefined, store => {
    socket.on("connect", () => {
        store.set(socket.id)
    })
})

export const username = writable("")

export const isMaster = customWritableStore(false, store => {
    socket.on("lobby:quit", () => {
        store.set(false)
    })
    socket.on("disconnect", () => {
        store.set(false)
    })
})

export const currentRoom = customWritableStore<string | undefined>(undefined, (store) => {
    socket.on("lobby:master", (room: string) => {
        store.set(room)
    })
    socket.on("lobby:quit", () => {
        store.set(undefined)
    })
    socket.on("disconnect", () => {
        store.set(undefined)
    })
})

export const isInLobby = customWritableStore(false, store => {
    socket.on("lobby:quit", () => {
        store.set(false)
    })
    socket.on("disconnect", () => {
        store.set(false)
    })
})

export const isGameStarted = customStore(false, store => {
    socket.on("game:start", () => {
        store.set(true)
    })
    socket.on("game:end", () => {
        store.set(false)
    })
    socket.on("lobby:quit", () => {
        store.set(false)
    })
    socket.on("disconnect", () => {
        store.set(false)
    })
})

const myIndex = customStore(Math.random(), store => {
    socket.on("lobby:shuffle", () => {

        const newindex = Math.random()
        store.set(newindex)

        sendInfo({
            id: get(myID)!,
            username: get(username),
            index: get(myIndex),
            color: myColor
        })
    })
})

export const myColor = colors[Math.round(Math.random() * colors.length)]

export const users = customStore(Map<string, User>(), store => {

    socket.on("lobby:info", (data: User) => {
        store.update(list => list.set(data.id, data))
    })
    socket.on("lobby:join", () => {
        sendInfo({
            id: get(myID)!,
            username: get(username),
            index: get(myIndex),
            color: myColor
        })
    })
    socket.on("lobby:leave", (sid: string) => {
        store.update(list => list.delete(sid))
    })
    socket.on("lobby:quit", () => {
        store.set(Map())
    })
    socket.on("disconnect", () => {
        store.set(Map())
    })
})

export const userList = derived(users, v => {
    const users = Array.from(v.values())

    return sortBy(users, u => u.index)
})

export const getUserIndex = derived(userList, v => {
    const users = Map(v.map((v, i) => [v.id, i]))

    return (id: string) => users.get(id) ?? 0
})