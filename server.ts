import express from 'express'
import path, { dirname } from 'path'
import { Server as SocketIO, Socket } from "socket.io";
import { createServer } from "http";
import cryptoRandomString from 'crypto-random-string';

const port = 3000

const app = express()
const server = createServer(app)
const io = new SocketIO(server)

const ROOMID_LENGTH = 6

const genRand = () => cryptoRandomString({
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    length: ROOMID_LENGTH
});

io.on("connection", (socket: Socket) => {
    let isMaster = false
    let room: string
    socket.on("lobby:create", () => {
        if (!room) {

            room = genRand()
            socket.join(room)

            socket.emit("lobby:master", room)
            socket.emit("lobby:join", room)
            isMaster = true
        } else {
            socket.emit("lobby:quit")
        }
    })

    socket.on("lobby:join", (roomID?: string) => {
        if (!isMaster && roomID && roomID.length == ROOMID_LENGTH && io.sockets.adapter.rooms.has(roomID)) {

            room = roomID
            socket.join(room)

            io.to(room).emit("lobby:join")
        } else {
            socket.emit("lobby:quit")
        }
    })

    socket.on("lobby:leave", () => {
        if (room) {
            if (isMaster) {
                io.in(room).emit("lobby:quit")
            } else {
                io.in(room).emit("lobby:leave", socket.id)
            }
        }
        socket.emit("lobby:quit")
    })

    socket.on("disconnect", () => {
        if (room) {
            if (isMaster) {
                io.in(room).emit("lobby:quit")
            } else {
                io.in(room).emit("lobby:leave", socket.id)
            }
        }
    })

    socket.onAny((event: string, ...args) => {
        const forwardToAll = [
            /game:.*/,
            /lobby:info/,
            /lobby:shuffle/,
        ]

        if (forwardToAll.some(reg => reg.test(event))) {
            io.to(room).emit(event, ...args)
        }
    })
})

/**
 * server stuff: 
 */
// app.use(express.static(dirname(require.resolve("bulma/css/bulma.css"))))
app.use("/webfonts", express.static(dirname(require.resolve("@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf"))))
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})
server.listen(port, () => {
    console.log(`App listening on ${port}`)
})
