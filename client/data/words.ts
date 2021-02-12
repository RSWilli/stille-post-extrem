export const words = [
    "Testword1",
    "Testword2",
    "Testword3",
    "Testword4",
    "Testword5",
    "Testword6",
]

// shuffle:
words.sort(() => Math.round(Math.random() * 2 - 1))