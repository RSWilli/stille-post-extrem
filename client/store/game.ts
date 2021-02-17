import { List, Map } from "immutable";
import { derived, get } from "svelte/store";
import { RoundData, sendData } from "../com/actions";
import { socket } from "../com/socket";
import { colors } from "../data/colors";
import { randomWord } from "../data/words";
import { customStore } from "../lib/helper";
import { getUserIndex, myID } from "./main";

export const roundMode = customStore<"text" | "draw">("draw", store => {
    socket.on("game:start", () => {
        store.set("draw")
    })
})

export const roundTimer = customStore(60, store => {
    let v: number

    store.subscribe((val) => {
        v = val
    })

    socket.on("game:start", () => {
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


export const gameData = customStore<Map<string, List<RoundData>>>(Map(), store => {

    let id: string

    myID.subscribe(v => id = v!)

    socket.on("game:start", () => {
        const round: RoundData = {
            type: "text",
            data: randomWord(),
        }

        sendData(id, round)
    })

    socket.on("game:data", (id: string, data: RoundData) => {
        store.update(d => d.update(
            id,
            List([data]),
            l => l.push(data)
        ))
    })
})

export const blocks = derived(gameData, data => {

})

export const myColor = derived(getUserIndex, getIndex => {
    return colors[getIndex(get(myID)!) ?? 0];
})