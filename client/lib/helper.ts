import { Readable, writable, Writable } from "svelte/store"

export const customStore = <V>(value: V, changeFn: (store: Writable<V>) => void): Readable<V> => {
    const store = writable(value)

    changeFn(store)

    return readonly(store)
}

export const customWritableStore = <V>(value: V, changeFn: (store: Writable<V>) => void): Writable<V> => {
    const store = writable(value)

    changeFn(store)

    return store
}

export const readonly = <T>(store: Readable<T> | Writable<T>): Readable<T> => {
    return {
        subscribe: store.subscribe
    }
}