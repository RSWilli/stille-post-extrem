import { socket } from "../com/socket";
import { randomWord } from "../data/words";
import { customStore } from "../lib/helper";

export const roundMode = customStore<"text" | "draw">("draw", store => {
    socket.on("gamestart", () => {
        store.set("draw")
    })
})

export const roundTimer = customStore(60, store => {
    let v: number

    store.subscribe((val) => {
        v = val
    })

    socket.on("gamestart", () => {
        store.set(60)

        let interval = setInterval(() => {
            if (v == 0) {
                clearInterval(interval)
            } else {
                store.update(v => v - 1)
            }
        }, 1000)
    })
})

export const word = customStore("", store => {
    socket.on("gamestart", () => {
        store.set(randomWord())
    })
})