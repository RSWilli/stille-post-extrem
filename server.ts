import express from 'express'
import path from 'path'
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
    socket.on("createroom", () => {
        if (!room) {
            console.log("creating room");

            room = genRand()

            socket.join(room)

            socket.emit("master", room)
            isMaster = true
        }
    })

    socket.on("joinroom", (username: string, roomID: string) => {
        if (!isMaster && roomID.length == 10) {
            if (!io.sockets.adapter.rooms.has(roomID)) {
                return
            }

            socket.join(room)
            room = roomID

            socket.to(room).emit("join", username, socket.id)
        }
    })

    socket.onAny((event: string, ...args) => {
        console.log(event, args);
    })
})

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})
server.listen(port, () => {
    console.log(`App listening on ${port}`)
})