
import Connector from './models/connector'
import ControlPanel from './models/control_panel'

import Game from './models/game'
import WebSocketClient from './models/web_socket_client'



const game: Game = new Game()


const webSocket: WebSocketClient = new WebSocketClient()



const connector: Connector = new Connector(webSocket)

const controlPanel: ControlPanel = new ControlPanel(connector)
