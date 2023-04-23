

import { TREE_HEIGHTS, TREE_WIDTHS } from '../constants'

import Color from './color'




class ItemBase {

    static heights: Array<number> = TREE_HEIGHTS
    static widths: Array<number> = TREE_WIDTHS

    static color: Color



    constructor(public zoom: number) {
        //
    }


    public getRandomColor(colors: Array<number> = Color.colors): number {

        return Color.getRandomColor(colors)
    }


    public getRandom(list: Array<number>): number {

        return list[Math.floor(Math.random() * list.length)]
    }


    public getRandomHeight(heights: Array<number> = ItemBase.heights): number {

        return this.getRandom(heights)
    }


    public getRandomWidth(widths: Array<number> = ItemBase.widths): number {

        return this.getRandom(widths)
    }


    public getRandomSign(): number {

        return Math.round(Math.random()) ? 1 : -1
    }


    public getRandomPosition(value: number): number {

        const sign: number = this.getRandomSign()

        return Math.floor(sign * Math.random() * value)
    }


}



export default ItemBase
