import express from 'express'
import path, { dirname } from 'path'
import { Server as SocketIO, Socket } from "socket.io";
import { createServer } from "http";
import { randomBytes } from 'crypto';

const port = 3000

const app = express()
const server = createServer(app)
const io = new SocketIO(server)

const genRand = () => randomBytes(5).toString("hex");

io.on("connection", (socket: Socket) => {
    let isMaster = false
    let room: string
    socket.on("createroom", (username?: string) => {
        if (!room && username) {
            console.log("creating room");

            room = genRand()

            socket.join(room)

            socket.emit("master", room)
            io.in(room).emit("join", username, socket.id)
            isMaster = true
        }
    })

    socket.on("joinroom", (username?: string, roomID?: string) => {
        if (!isMaster && roomID && roomID.length == 10) {
            if (!io.sockets.adapter.rooms.has(roomID)) {
                return
            }

            console.log(socket.id)

            console.log(io.sockets.adapter.rooms)

            room = roomID
            socket.join(room)

            console.log(io.sockets.adapter.rooms)

            socket.emit("joined", username, room)
            socket.to(room).broadcast.emit("join", username, socket.id)
        }
    })

    socket.on("leaveroom", () => {
        if (room) {
            if (isMaster) {
                io.in(room).emit("quit")
            } else {
                io.in(room).emit("leave", socket.id)
            }
        }
        socket.emit("quit")
    })

    socket.on("disconnect", () => {
        if (room) {
            if (isMaster) {
                io.in(room).emit("quit")
            } else {
                io.in(room).emit("leave", socket.id)
            }
        }
    })

    socket.on("info", (...args) => {
        socket.to(room).broadcast.emit("info", ...args)
    })

    socket.onAny((event: string, ...args) => {
        console.log(event, args);
        const forward = (cmp: string) => {
            if (event == cmp) io.to(room).emit(cmp)
        }

        forward("gamestart")
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
