

import { ACTION, MESSAGE } from '../../common/constants'
import { CUSTOM_EVENT } from '../constants'

import WebSocketClient from './web_socket_client'



import type { AbstractConnector, Listener } from '../interfaces'
import type { ChatMessage, DataWIthRoomNumber, GameRoomBase, GridCell, ActionParameters, ActionData } from '../../common/interfaces'





export interface RoomData extends GameRoomBase {
    isFirstPlayer: boolean,
    isMyTurn: boolean
}



class Connector implements AbstractConnector {


    private ws: WebSocketClient

    private roomNumber!: number


    public userId!: string



    private dispatchCustomEvent<Data = any>(type: CUSTOM_EVENT, data: Data) {

        const event = new CustomEvent(type, { detail: { data }})

        document.dispatchEvent(event)
    }


    private listeners: Array<Listener> = [
        {
            type: MESSAGE.SET_ROOMS_DATA,
            callback: (data: GameRoomBase) => {

                const { roomNumber, players } = data

                this.roomNumber = roomNumber


                if (players.length > 1) {

                    this.userId = this.ws.getSocketId()

                    this.dispatchCustomEvent(CUSTOM_EVENT.CONNECT, data)

                }
            }
        },
        {
            type: MESSAGE.CONNECT,
            callback: () => {

                console.debug('🚀 ~ file: connector.ts:65 ~ Connector ~ CONNECTED')
            }
        },
        {
            type: MESSAGE.MAP,
            callback: (data: Array<GridCell>) => {

                this.dispatchCustomEvent(CUSTOM_EVENT.SET_MAP, data)
            }
        },
        {
            type: MESSAGE.LEFT_ROOM,
            callback: (data: GameRoomBase) => {

                this.dispatchCustomEvent(CUSTOM_EVENT.OPPONENT_FLED, data)
            }
        },
        {
            type: MESSAGE.TURN,
            callback: (data: GameRoomBase) => {

                const { isOver } = data

                if (isOver) {

                    this.dispatchCustomEvent(CUSTOM_EVENT.GAME_OVER_MOVES_LIMIT, data)

                } else {

                    this.dispatchCustomEvent(CUSTOM_EVENT.TURN, data)
                }
            }
        },
        {
            type: MESSAGE.ACTION,
            callback: (data: ActionData) => {

                const { actionData } = data
                const { id, type } = actionData

                const condition: boolean = ((type == ACTION.TRAP)
                    && (id != this.userId))
                    || (type != ACTION.TRAP)

                if (condition) {

                    this.dispatchCustomEvent(CUSTOM_EVENT.ACTION, data)
                }
            }
        }
    ]


    constructor() {

        this.ws = new WebSocketClient(this.listeners)
    }


    public checkConnection(): boolean {

        return this.ws.checkConnection()
    }


    private addRoomNumber<Data = any>(data: Data): DataWIthRoomNumber<Data> {

        return {
            ...data,
            roomNumber: this.roomNumber
        }
    }


    public sendMessage(message: string): void {

        this.ws.sendData(
            this.addRoomNumber<ChatMessage>({ message }),
            MESSAGE.CHAT_MESSAGE
        )
    }


    public initMap<Data = any>(data: Data) {

        this.ws.sendData(
            this.addRoomNumber<Data>(data),
            MESSAGE.INIT_MAP
        )
    }


    public mapInitialized() {

        this.ws.sendData(
            this.addRoomNumber({}),
            MESSAGE.MAP_INITIALIZED
        )
    }


    public sendAction(parameters: ActionParameters) {

        this.ws.sendData(
            this.addRoomNumber<ActionParameters>(parameters),
            MESSAGE.ACTION
        )
    }
}




export default Connector
