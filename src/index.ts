
import Connector from './models/connector'

import Game from './models/game'



const connector: Connector = new Connector()


const game: Game = new Game(connector)
