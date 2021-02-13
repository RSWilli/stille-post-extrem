import { io } from "socket.io-client";

export const socket = io()

export const createRoom = (username: string) => {
    socket.emit("createroom", username)
}

export const joinRoom = (username: string, room: string) => {
    socket.emit("joinroom", username, room)
}

export const leaveRoom = () => {
    socket.emit("leaveroom")
}

export const startGame = () => {
    socket.emit("gamestart")
}

