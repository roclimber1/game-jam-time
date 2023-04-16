
import { io } from 'socket.io-client'



import type { Socket } from 'socket.io-client'
import type { AbstractConnector } from '@/src/interfaces/AbstractConnector'




class WebSocketClient implements AbstractConnector {

    private socket: Socket


    constructor() {

        this.socket = io()

        this.initListeners()
    }


    private initListeners(): void {

        this.socket.on('connect', () => {

            console.debug('connected to webSocket server')
        })

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


    public checkConnection(): boolean {

        return this.socket.connected
    }


    public sendMessage(message: string): void {

        if (this.checkConnection()) {

            this.socket.emit('chat message', { message })
        }
    }
}



export default WebSocketClient
