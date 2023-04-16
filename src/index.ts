
import Connector from './models/connector'
import ControlPanel from './models/control_panel'

import Game from './models/game'
import WebSocketClient from './models/web_socket_client'



new Game()


const webSocket = new WebSocketClient()



const connector = new Connector(webSocket)

const controlPanel = new ControlPanel(connector)
