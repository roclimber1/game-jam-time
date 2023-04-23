
import { INIT_RESOURCES } from '../../common/constants'



import type { GameEngineBase, Resources } from '../../common/interfaces'



class GameEngine implements GameEngineBase {

    public score!: Array<number>
    public resources!: Array<Resources>

    public static yourIndex = 0
    public static opponentIndex = 1

    public firstPlayer = false


    constructor() {

        this.init()
    }


    private init() {

        this.score = [0,0]
        this.resources = [INIT_RESOURCES, INIT_RESOURCES]

        this.firstPlayer = false
    }


    public updateFirstPlayer(id: string, firstId: string): boolean {

        this.firstPlayer = (id == firstId)

        return this.firstPlayer
    }


    public getGameData(): GameEngineBase {

        return {
            firstPlayer: this.firstPlayer,
            resources: this.resources,
            score: this.score
        }
    }


    public updateGameData(data: GameEngineBase) {

        const { score, resources } = data

        this.score = score
        this.resources = resources
    }
}




export default GameEngine
