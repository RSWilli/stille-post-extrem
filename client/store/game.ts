import { getIn, List, Map } from "immutable";
import sortBy from "lodash.sortby";
import { derived } from "svelte/store";
import { RoundData, sendData } from "../com/actions";
import { socket } from "../com/socket";
import { randomWord } from "../data/words";
import { customStore } from "../lib/helper";
import { myID, users, getUserIndex } from "./main";

/**
 * the gamedata maps a userid to each word/drawing they have made
 */
export const gameData = customStore<Map<string, List<RoundData>>>(Map(), store => {

    socket.on("game:start", () => {
        store.set(Map())

        sendData({
            type: "text",
            data: randomWord(),
        })
    })

    socket.on("game:data", (id: string, data: RoundData) => {
        store.update(d => d.update(
            id,
            List(),
            l => l.push(data)
        ))
    })

    socket.on("lobby:quit", () => store.set(Map()))
    socket.on("disconnect", () => store.set(Map()))
})

gameData.subscribe(v => console.log("gameData", v))

/**
 * map the gameData to blocks, which are the sequence of words/drawings on the same topic
 */
export const blocks = derived([gameData, users], ([data, users]) => {
    const byUser = Array.from(data.entries())

    const ordered = sortBy(byUser, ([id, data]) => users.get(id)?.index ?? 0)
        .map(([id, data]) => data)

    return Map(ordered.map((data, blockNum) =>
        [
            blockNum,
            data.map((_, round) =>
                ordered[(blockNum + round) % ordered.length].get(round)!
            )
        ]
    ))
})

blocks.subscribe(v => console.log("blocks", v))

export const round = derived(gameData, data => {
    const d = Array.from(data.values())

    return Math.min(...[0, ...d.map(stack => stack.size - 1)])
})

round.subscribe(v => console.log("round", v))

export const currentData = derived([blocks, round, myID, getUserIndex], ([blocks, round, id, getIndex]) => {
    const index = getIndex(id ?? "")

    console.log("index", index)

    console.log("blocknumber", (index + round) % blocks.size)

    return blocks.get((index + round) % blocks.size)?.last(undefined)
})

currentData.subscribe(v => console.log("currentData", v))

export const roundTimer = customStore(60, store => {
    let v: number

    store.subscribe((val) => {
        v = val
    })

    setInterval(() => {
        if (v != 0) {
            store.update(v => v - 1)
        }
    }, 1000)

    // round.subscribe(() => {
    //     store.set(60)
    // })

    currentData.subscribe(() => {
        store.set(60)
    })
})