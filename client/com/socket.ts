import { io } from "socket.io-client";

export const socket = io()

export const createRoom = () => {
    socket.emit("createroom")
}

export const joinRoom = (username: string, room: string) => {
    socket.emit("joinroom", username, room)
}