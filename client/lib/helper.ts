import { Readable, writable, Writable } from "svelte/store";

type Updater<T> = (update: Writable<T>["update"]) => void

export const updatable = <T>(value: T, updater: Updater<T>): Readable<T> => {
    const store = writable(value)

    updater(store.update)

    return {
        subscribe: store.subscribe
    }
}