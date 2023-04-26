

type Selection = {
    available: number,
    unavailable: number
}


class Color {

    static colors: Array<number> = [0x7aa21d, 0x4d6b07, 0x08a817]

    static grass: Array<number> = [0xbaf455, 0x99C846]
    static tiles: Array<number> = [0x885600, 0x967132]

    static boulders: Array<number> = [0xffc898, 0xfffbc3]

    static units: Array<number> = [0xdfaa2f, 0xb95333]


    static ground = 0x99C846

    static selection: Selection = {
        available: 0x65a30d,
        unavailable: 0xc2410c
    }

    static lastLine = 0x882000


    constructor() {
        //
    }


    static getRandomColor(colors: Array<number> = Color.colors): number {

        const color: number = colors[Math.floor(Math.random() * colors.length)]

        return color
    }

}



export default Color
