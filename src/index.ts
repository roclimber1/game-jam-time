
import Connector from './models/connector'
import ControlPanel from './models/control_panel'

import Game from './models/game'



const connector: Connector = new Connector()


const game: Game = new Game(connector)




const controlPanel: ControlPanel = new ControlPanel(connector)
