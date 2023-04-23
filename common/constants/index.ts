
import { Resources } from '../interfaces'


export enum MESSAGE {
    CHAT_MESSAGE = 'CHAT_MESSAGE',
    CONNECT = 'connect',
    INIT_MAP = 'INIT_MAP',
    MAP = 'MAP',
    SET_ROOMS_DATA = 'SET_ROOMS_DATA',
    LEFT_ROOM = 'LEFT_ROOM'
}


export enum ITEM {
    BOULDER = 'BOULDER',
    EMPTY = 'EMPTY',
    MUSHROOM = 'MUSHROOM',
    TREE = 'TREE',
    UNIT = 'UNIT'
}


export const TREE_HEIGHTS: Array<number> = [20, 30, 35, 40, 45, 55, 60, 70]

export const TREE_WIDTHS: Array<number> = [25, 30, 35, 40, 45, 50]


export const BOULDER_WIDTHS: Array<number> = [5, 7, 10, 13, 15, 17, 19]

export const BOULDER_SEGMENTS: Array<number> = [4, 6, 8]



export enum RESOURCE {
    STONE = 'stone',
    WOOD = 'wood'
}


export enum POINTS {
    MOVES = 2,
    RESOURCES = 1,
    TRAP = 5,
}


export const INIT_RESOURCES: Resources = {
    stone: 0,
    wood: 0
}
