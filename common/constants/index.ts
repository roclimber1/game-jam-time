
import { Resources } from '../interfaces'


export enum MESSAGE {
    CHAT_MESSAGE = 'CHAT_MESSAGE',
    CONNECT = 'connect',
    INIT_MAP = 'INIT_MAP',
    LEFT_ROOM = 'LEFT_ROOM',
    MAP = 'MAP',
    MAP_INITIALIZED = 'MAP_INITIALIZED',
    SET_ROOMS_DATA = 'SET_ROOMS_DATA',
    TURN = 'TURN'
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


export enum ENERGY {
    MOVE_SIMPLE = 1,
    MOVE_DIAGONAL = 2,
    STONE = 2,
    WOOD = 2,
    TRAP = 4
}


export const INIT_RESOURCES: Resources = {
    stone: 0,
    wood: 0
}


export enum SETTINGS {
    ENERGY = 4,
    TOTAL_MOVES = 2 * 2, // 30 * 2
    TURN_TIME = 7
}
