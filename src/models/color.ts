


class Color {

    static colors: Array<number> = [0x7aa21d, 0x4d6b07, 0x08a817]

    static grass: Array<number> = [0xbaf455, 0x99C846]
    static tiles: Array<number> = [0x885600, 0x967132]


    constructor() {
        //
    }


    static getRandomColor(colors: Array<number> = Color.colors): number {

        const color: number = colors[Math.floor(Math.random() * colors.length)]

        return color
    }

}



export default Color
