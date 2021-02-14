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
    socket.on("lobby:create", (username?: string) => {
        if (!room && username) {

            room = genRand()
            console.log("creating room", room)

            socket.join(room)

            socket.emit("lobby:master", room)
            io.in(room).emit("lobby:join", username, socket.id)
            isMaster = true
        }
    })

    socket.on("lobby:join", (username?: string, roomID?: string) => {
        if (!isMaster && username && roomID && roomID.length == ROOMID_LENGTH) {
            if (!io.sockets.adapter.rooms.has(roomID)) {
                return
            }

            console.log(socket.id)

            console.log(io.sockets.adapter.rooms)

            room = roomID
            socket.join(room)

            console.log(io.sockets.adapter.rooms)

            socket.emit("lobby:joined", username, room)
            socket.to(room).broadcast.emit("lobby:join", username, socket.id)
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

    socket.on("lobby:info", (...args) => {
        socket.to(room).broadcast.emit("lobby:info", ...args)
    })

    socket.onAny((event: string, ...args) => {
        if (/^game:.*/.test(event)) {
            io.to(room).emit(event)
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
