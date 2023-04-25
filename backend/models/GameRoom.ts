
import { ACTION, BOULDER_SEGMENTS, BOULDER_WIDTHS, ENERGY, INIT_RESOURCES, ITEM, POINTS, RESOURCE, SETTINGS } from '../../common/constants'
import { ActionParameters, GameEngineBase, GameRoomBase, GridCell, PlayerBase, Resources } from '../../common/interfaces'

import ItemBase from '../../common/models/item_base'
import Color from '../../common/models/color'
import GameEngineAbstract from '../../common/models/game_engine_abstract'


export class Player implements PlayerBase {

    public name = 'Alice'


    constructor(
        public id: string
    ) {}


    public setName(name: string) {

        this.name = name
    }
}


class GameRoom implements GameRoomBase {

    public players: Array<PlayerBase> = []
    public firstPlayerIndex = 0

    public id = ''

    static roomPrefix = 'game-room-'

    public isFirstPlayer = false

    public map: Array<GridCell> = []


    public currentTurnId = ''
    public currentTurnIndex = 0

    public movesCounter = 0
    public isOver = false


    public gameData: GameEngineBase


    private gameEngine: GameEngineAbstract



    public static getRoomId(roomNumber: number): string {

        return `${this.roomPrefix}${roomNumber}`
    }


    constructor(
        public roomNumber: number,
        rooms: Map<string, Set<string>>
    ) {

        this.updatePlayers(rooms)


        this.gameEngine = new GameEngineAbstract()
        this.gameData = this.gameEngine.getGameData()
    }


    private tossUp() {

        this.firstPlayerIndex = Math.round(Math.random())

        this.currentTurnId = this.players[this.firstPlayerIndex]?.id
        this.currentTurnIndex = this.firstPlayerIndex
    }


    public setFirstPlayer() {

        this.firstPlayerIndex = 0

        this.currentTurnId = this.players[this.firstPlayerIndex]?.id
        this.currentTurnIndex = this.firstPlayerIndex
    }


    public updatePlayers(rooms: Map<string, Set<string>>) {

        this.id = GameRoom.getRoomId(this.roomNumber)
        const playersSet = rooms.get(this.id)


        playersSet?.forEach((value) => {

            if (!this.players.find(item => item.id == value)) {

                this.players.push(new Player(value))
            }
        })

        this.tossUp()
    }


    public removePlayer(id: string) {

        this.players = this.players.filter(item => item.id != id)
    }


    public getPlayerIndexById(id: string): number {

        let playerIndex = 0

        this.players.forEach((item, index) => {

            if (item.id == id) {

                playerIndex = index
            }
        })

        return playerIndex
    }


    public getCurrentTurnUser(id: string): void {


        const player = this.players.find((item, index) => {

            const state: boolean = (item.id != id)

            if (state) {

                this.currentTurnIndex = index
            }

            return state
        })


        this.currentTurnId = player?.id as string
    }



    private generateMap(grid: Array<GridCell>) {

        if (!this.map.length) {

            const itemsArray: Array<ITEM> = [ITEM.TREE, ITEM.BOULDER]
            const newGrid: Array<GridCell> = [...grid]

            const baseItem: ItemBase = new ItemBase(2)


            itemsArray.forEach((item: ITEM) => {

                for (const i in newGrid) {

                    const gridCell: GridCell = newGrid[i]

                    const odds: boolean = (baseItem.getRandomSign() + baseItem.getRandomSign() + baseItem.getRandomSign()) > 1.5


                    if (odds && !gridCell.occupied) {

                        newGrid[i].occupied = true
                        newGrid[i].type = item


                        switch (item) {

                            case ITEM.BOULDER:

                                newGrid[i].parameters = {
                                    width: baseItem.getRandomWidth(BOULDER_WIDTHS),
                                    segments: baseItem.getRandom(BOULDER_SEGMENTS),
                                    color: baseItem.getRandomColor(Color.boulders)
                                }

                                break

                            case ITEM.TREE:

                                newGrid[i].parameters = {
                                    width: baseItem.getRandomWidth(),
                                    height: baseItem.getRandomHeight(),
                                    color: baseItem.getRandomColor()
                                }

                                break
                        }
                    }
                }
            })


            this.map = newGrid
        }
    }


    private calculateSum(initValue: number, addValue: number): number {

        const sum: number = Math.round(initValue + addValue)

        return sum
    }


    private updateScore(id: string, points: POINTS) {

        const index: number = this.getPlayerIndexById(id)


        this.gameData.score[index] = this.calculateSum(this.gameData.score[index], points)
    }


    private addResource(id: string, type: RESOURCE): GameRoomBase {

        const index: number = this.getPlayerIndexById(id)


        this.gameData.resources[index][type] = this.calculateSum(this.gameData.resources[index][type], 1)

        this.updateScore(id, POINTS.RESOURCES)


        return this.getRoomData()
    }


    private useEnergy(id: string, energy: ENERGY): GameRoomBase {

        const index: number = this.getPlayerIndexById(id)


        this.gameData.energy[index] = this.calculateSum(this.gameData.energy[index], -energy)


        return this.getRoomData()
    }


    private useResource(id: string, type: RESOURCE, value: number): GameRoomBase {

        const index: number = this.getPlayerIndexById(id)


        this.gameData.resources[index][type] = this.calculateSum(this.gameData.resources[index][type], -value)


        return this.getRoomData()
    }


    private addWood(id: string): GameRoomBase {

        this.addResource(id, RESOURCE.WOOD)

        const newGameData: GameRoomBase = this.useEnergy(id, ENERGY.WOOD)


        return newGameData
    }


    private addStone(id: string): GameRoomBase {

        this.addResource(id, RESOURCE.STONE)

        const newGameData: GameRoomBase = this.useEnergy(id, ENERGY.STONE)


        return newGameData
    }


    private addTrap(id: string, position: GridCell): GameRoomBase {

        const index: number = this.getPlayerIndexById(id)

        this.gameData.traps[index].push(position)


        return this.getRoomData()
    }


    public setTrap(id: string, position: GridCell) {

        this.useResource(id, RESOURCE.STONE, SETTINGS.TRAP_STONE)
        this.useResource(id, RESOURCE.WOOD, SETTINGS.TRAP_WOOD)

        this.addTrap(id, position)

        this.updateScore(id, POINTS.TRAP)

        const newGameData: GameRoomBase = this.useEnergy(id, ENERGY.WOOD)


        return newGameData
    }


    public updateTrappedState(id: string, value: number) {

        //
    }


    public checkTraps(id: string, position: GridCell): boolean {

        let state = false

        return state
    }


    public makeMove(id: string, type: ACTION, position: GridCell): GameRoomBase {

        let points: POINTS = POINTS.MOVE_SIMPLE
        let energy: ENERGY = ENERGY.MOVE_SIMPLE


        switch (type) {

            case ACTION.MOVE_DIAGONAL:

                points = POINTS.MOVE_DIAGONAL
                energy = ENERGY.MOVE_DIAGONAL

                break

            case ACTION.MOVE_SIMPLE:

                points = POINTS.MOVE_SIMPLE
                energy = ENERGY.MOVE_SIMPLE

                break
        }

        this.updateScore(id, points)
        this.useEnergy(id, energy)


        if (this.checkTraps(id, position)) {

            this.updateTrappedState(id, SETTINGS.TRAP_TURNS)
        }


        return this.getRoomData()
    }


    public performAction(parameters: ActionParameters): boolean {

        const { id, type, position } = parameters

        let performed = false


        if (id == this.currentTurnId) {

            const index: number = this.getPlayerIndexById(id)
            const energy: number = this.gameData.energy[index]
            const resources: Resources = this.gameData.resources[index]


            const state: boolean = this.gameEngine.checkActionAvailability(type, energy, resources)

            performed = state


            if (state) {

                switch (type) {

                    case ACTION.MOVE_DIAGONAL:

                        // break omitted intentionally

                    case ACTION.MOVE_SIMPLE:

                        this.makeMove(id, type, position)

                        break

                    case ACTION.STONE:

                        this.addStone(id)

                        break

                    case ACTION.WOOD:

                        this.addWood(id)

                        break

                    case ACTION.TRAP:

                        this.setTrap(id, position)

                        break
                }

            }


        }


        return performed
    }


    public getMap(grid: Array<GridCell>): Array<GridCell> {

        this.generateMap(grid)

        return this.map
    }


    private intervalHandler: NodeJS.Timer | null = null


    public startTimer(callback: () => void) {

        this.intervalHandler = setInterval(() => {

            this.getCurrentTurnUser(this.currentTurnId)


            this.gameData.energy[this.currentTurnIndex] = SETTINGS.ENERGY
            this.gameData.moves[this.currentTurnIndex] = SETTINGS.TURN_MOVES


            this.movesCounter++


            this.isOver = (this.movesCounter >= SETTINGS.TOTAL_MOVES)

            if (this.isOver) {

                this.intervalHandler && clearInterval(this.intervalHandler)
            }

            callback()

        }, SETTINGS.TURN_TIME * 1000)
    }


    public getRoomData(): GameRoomBase {


        return {
            currentTurnId: this.currentTurnId,
            firstPlayerIndex: this.firstPlayerIndex,
            gameData: this.gameData,
            id: this.id,
            isOver: this.isOver,
            map: this.map,
            movesCounter: this.movesCounter,
            players: this.players.map((item) => ({
                id: item.id,
                name: item.name
            })),
            roomNumber: this.roomNumber
        }
    }
}



export default GameRoom
