
import { Resources } from '../interfaces'


export enum MESSAGE {
    ACTION = 'ACTION',
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
    TRAP = 'TRAP',
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
    MOVE_DIAGONAL = 15,
    MOVE_SIMPLE = 10,
    RESOURCES = 15,
    TRAP = 50,
}


export enum ENERGY {
    MOVE_DIAGONAL = 20,
    MOVE_SIMPLE = 15,
    STONE = 20,
    TRAP = 30,
    WOOD = 15
}


export const INIT_RESOURCES: Resources = {
    stone: 0,
    wood: 0
}


export enum SETTINGS {
    ENERGY = 35,
    TOTAL_MOVES = 4 * 2, // 30 * 2
    TRAP_STONE = 2,
    TRAP_TURNS = 2,
    TRAP_WOOD = 3,
    TURN_MOVES = 2,
    TURN_TIME = 7
}


export enum ACTION {
    MOVE_DIAGONAL = 'MOVE_DIAGONAL',
    MOVE_SIMPLE = 'MOVE_SIMPLE',
    NONE = 'NONE',
    STONE = 'STONE',
    TRAP = 'TRAP',
    WOOD = 'WOOD'
}


export const ACTIONS: Array<ACTION> = [
    ACTION.MOVE_DIAGONAL,
    ACTION.MOVE_SIMPLE,
    ACTION.STONE,
    ACTION.TRAP,
    ACTION.WOOD
]
