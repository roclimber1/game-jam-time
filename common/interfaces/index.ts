
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
    gameData: GameEngineBase,
    id: string,
    map: Array<GridCell>,
    players: Array<PlayerBase>,
    roomNumber: number
}


export type GridCell<Parameters = any> = {
    centreX: number,
    centreY: number,
    id: string,
    indexX: number,
    indexY: number,
    item?: THREE.Object3D,
    object: THREE.Object3D,
    occupied: boolean,
    parameters: Parameters,
    position: THREE.Vector3,
    type: ITEM
}


export type DataWIthRoomNumber<Data = any> = Data & { roomNumber: number }


export type GridCellData = { grid: Array<GridCell> }



export type Resources = {
    stone: number,
    wood: number
}


export interface GameEngineBase {
    firstPlayer?: boolean,
    score: Array<number>,
    resources: Array<Resources>
}


export type CommonParameters = {
    color: number,
    width: number
}


export type BoulderParameters = CommonParameters & {
    segments: number
}


export type TreeParameters = CommonParameters & {
    height: number
}
