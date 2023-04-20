
import { io } from 'socket.io-client'

import { MESSAGE } from '@/common/constants'




import type { Socket } from 'socket.io-client'
import type { AbstractConnector, Listener } from '@/src/interfaces'




class WebSocketClient implements AbstractConnector {

    private socket: Socket


    constructor(listeners: Array<Listener>) {

        this.socket = io()

        this.init()
        this.initListeners(listeners)
    }


    private init(): void {

        this.socket.on('disconnect', (reason) => {

            if (reason === 'io server disconnect') {

                this.socket.connect()
            }

            console.debug('disconnected from webSocket server')
        })

        this.socket.on('error', (error) => {

            console.debug('error in webSocket server', error)
        })

    }



    private initListeners(listeners: Array<Listener>): void {

        for (const listener of listeners) {

            const { type, callback } = listener

            this.socket.on(type, callback)
        }
    }


    public checkConnection(): boolean {

        return this.socket.connected
    }


    public sendData<Data = any>(data: Data, type: MESSAGE): void {

        if (this.checkConnection()) {

            this.socket.emit(type, data)
        }
    }
}



export default WebSocketClient
