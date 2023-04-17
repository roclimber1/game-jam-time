
import Color from './color'




class Item {

    static heights: Array<number> = [20, 30, 35, 40, 45, 55, 60, 70]
    static widths: Array<number> = [25, 30, 35, 40, 45, 50]


    static color: Color


    constructor(public zoom: number) {
        //
    }


    public getRandom(list: Array<number>): number {

        return list[Math.floor(Math.random() * list.length)]
    }


    public getRandomHeight(heights: Array<number> = Item.heights): number {

        return this.getRandom(heights)
    }


    public getRandomWidth(widths: Array<number> = Item.widths): number {

        return this.getRandom(widths)
    }


    public getRandomColor(colors: Array<number> = Color.colors): number {

        return Color.getRandomColor(colors)
    }


    public getRandomSign(): number {

        return Math.round(Math.random()) ? 1 : -1
    }


    public getRandomPosition(value: number): number {

        const sign: number = this.getRandomSign()

        return Math.floor(sign * Math.random() * value)
    }


    public render(): any {

        return null
    }
}



export default Item
