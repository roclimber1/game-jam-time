

import { MESSAGE } from '../../common/constants'
import { CUSTOM_EVENT } from '../constants'

import WebSocketClient from './web_socket_client'



import type { AbstractConnector, Listener } from '../interfaces'
import type { ChatMessage, DataWIthRoomNumber, GameRoomBase, GridCell } from '../../common/interfaces'





export interface RoomData extends GameRoomBase {
    isFirstPlayer: boolean,
    isMyTurn: boolean
}



class Connector implements AbstractConnector {


    private ws: WebSocketClient

    private roomNumber!: number



    private dispatchCustomEvent<Data = any>(type: CUSTOM_EVENT, data: Data) {

        const event = new CustomEvent(type, { detail: { data }})

        document.dispatchEvent(event)
    }


    private listeners: Array<Listener> = [
        {
            type: MESSAGE.SET_ROOMS_DATA,
            callback: (data) => {

                const { roomNumber } = data

                this.roomNumber = roomNumber


                this.dispatchCustomEvent(CUSTOM_EVENT.CONNECT, {})
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
}




export default Connector
