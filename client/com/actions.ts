import { currentRoom, isInLobby, isMaster } from "../store/main"
import { socket } from "./socket"

export const createRoom = () => {
    isInLobby.set(true)
    isMaster.set(true)
    socket.emit("lobby:create")
}

export const joinRoom = (room: string) => {
    currentRoom.set(room)
    isInLobby.set(true)
    socket.emit("lobby:join", room)
}

export const leaveRoom = () => {
    socket.emit("lobby:leave")
}

export const shuffleLobby = () => {
    socket.emit("lobby:shuffle")
}

export const startGame = () => {
    socket.emit("game:start")
}

export interface RoundData {
    type: "text" | "draw"
    data: string
}

export const sendData = (data: RoundData) => {
    socket.emit("game:data", socket.id, data)
}

export interface User {
    id: string
    username: string
    /**
     * random index for ordering
     */
    index: number
    color: string
}

export const sendInfo = (data: User) => {
    socket.emit("lobby:info", data)
}
