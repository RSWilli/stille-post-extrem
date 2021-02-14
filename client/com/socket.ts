import { io } from "socket.io-client";

export const socket = io()

export const createRoom = (username: string) => {
    socket.emit("lobby:create", username)
}

export const joinRoom = (username: string, room: string) => {
    socket.emit("lobby:join", username, room)
}

export const leaveRoom = () => {
    socket.emit("lobby:leave")
}

export const startGame = () => {
    socket.emit("game:start")
}

export interface RoundData {
    type: "text" | "draw"
    data: string
}

export const sendData = (id: string, data: RoundData) => {
    socket.emit("game:data", id, data)
}

