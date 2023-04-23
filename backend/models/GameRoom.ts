
import { BOULDER_SEGMENTS, BOULDER_WIDTHS, INIT_RESOURCES, ITEM, POINTS, RESOURCE } from '../../common/constants'
import { GameEngineBase, GameRoomBase, GridCell, PlayerBase } from '../../common/interfaces'

import ItemBase from '../../common/models/item_base'
import Color from '../../common/models/color'


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


    public gameData: GameEngineBase


    public static getRoomId(roomNumber: number): string {

        return `${this.roomPrefix}${roomNumber}`
    }


    constructor(
        public roomNumber: number,
        rooms: Map<string, Set<string>>
    ) {

        this.updatePlayers(rooms)


        this.gameData = {
            score: [0,0],
            resources: [INIT_RESOURCES, INIT_RESOURCES]
        }
    }


    private tossUp() {

        this.firstPlayerIndex = Math.round(Math.random())
        this.currentTurnId = this.players[this.firstPlayerIndex]?.id
    }


    public setFirstPlayer() {

        this.firstPlayerIndex = 0
        this.currentTurnId = this.players[this.firstPlayerIndex]?.id
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

        const player = this.players.find(item => item.id != id)

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


    public addResource(id: string, type: RESOURCE): GameRoomBase {

        const index: number = this.getPlayerIndexById(id)

        this.gameData.resources[index][type] += 1
        this.gameData.score[index] += POINTS.RESOURCES

        return this.getRoomData()
    }


    public addWood(id: string): GameRoomBase {

        const newGameData: GameRoomBase = this.addResource(id, RESOURCE.WOOD)

        return newGameData
    }


    public addStone(id: string): GameRoomBase {

        const newGameData: GameRoomBase = this.addResource(id, RESOURCE.STONE)

        return newGameData
    }


    public getMap(grid: Array<GridCell>): Array<GridCell> {

        this.generateMap(grid)

        return this.map
    }


    public getRoomData(): GameRoomBase {


        return {
            currentTurnId: this.currentTurnId,
            firstPlayerIndex: this.firstPlayerIndex,
            gameData: this.gameData,
            id: this.id,
            map: this.map,
            players: this.players.map((item) => ({
                id: item.id,
                name: item.name
            })),
            roomNumber: this.roomNumber
        }
    }
}



export default GameRoom
