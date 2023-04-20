
import { ITEM } from '../../common/constants'
import { GameRoomBase, GridCell, PlayerBase } from '../../common/interfaces'



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



    public static getRoomId(roomNumber: number): string {

        return `${this.roomPrefix}${roomNumber}`
    }


    constructor(
        public roomNumber: number,
        rooms: Map<string, Set<string>>
    ) {

        this.updatePlayers(rooms)
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


    public getCurrentTurnUser(id: string): void {

        const player = this.players.find(item => item.id != id)

        this.currentTurnId = player?.id as string
    }



    private getRandomSign(): number {

        return Math.round(Math.random()) ? 1 : -1
    }


    private generateMap(grid: Array<GridCell>) {

        if (!this.map.length) {

            const itemsArray: Array<ITEM> = [ITEM.TREE, ITEM.BOULDER]
            const newGrid: Array<GridCell> = [...grid]


            itemsArray.forEach((item: ITEM) => {

                for (const i in newGrid) {

                    const gridCell: GridCell = newGrid[i]

                    const odds: boolean = (this.getRandomSign() + this.getRandomSign()) > 1


                    if (odds && !gridCell.occupied) {

                        newGrid[i].occupied = true
                        newGrid[i].type = item
                    }
                }
            })


            this.map = newGrid
        }
    }


    public getMap(grid: Array<GridCell>): Array<GridCell> {

        this.generateMap(grid)

        return this.map
    }


    public getRoomData(): GameRoomBase {


        return {
            currentTurnId: this.currentTurnId,
            firstPlayerIndex: this.firstPlayerIndex,
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
