
import { ITEM } from '../constants'


export interface ChatMessage {
    message: string
}


export interface PlayerBase {
    id: string,
    name?: string
}

export interface GameRoomBase {
    currentTurnId: string,
    firstPlayerIndex: number,
    id: string,
    map: Array<GridCell>,
    players: Array<PlayerBase>,
    roomNumber: number
}


export type GridCell = {
    centreX: number,
    centreY: number,
    id: string,
    indexX: number,
    indexY: number,
    object: THREE.Object3D,
    occupied: boolean,
    position: THREE.Vector3,
    type: ITEM
}


export type DataWIthRoomNumber<Data = any> = Data & { roomNumber: number }


export type GridCellData = { grid: Array<GridCell> }
