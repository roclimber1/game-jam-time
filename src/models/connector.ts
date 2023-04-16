

import type { AbstractConnector } from '@/src/interfaces/AbstractConnector'
import type WebSocketClient from '@/src/models/web_socket_client'



class Connector implements AbstractConnector {


    private ws: WebSocketClient


    constructor(ws: WebSocketClient) {

        this.ws = ws
    }


    public checkConnection(): boolean {

        return this.ws.checkConnection()
    }


    public sendMessage(message: string): void {

        this.ws.sendMessage(message)
    }
}




export default Connector
