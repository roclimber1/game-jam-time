
import type { GameEngineBase } from '../interfaces'



class GameEngine implements GameEngineBase {

    public score!: Array<number>

    public static yourIndex = 0
    public static opponentIndex = 1

    public firstPlayer = false


    constructor() {

        this.init()
    }


    private init() {

        this.score = [0,0]
        this.firstPlayer = false
    }


    public updateFirstPlayer(id: string, firstId: string): boolean {

        this.firstPlayer = (id == firstId)

        return this.firstPlayer
    }


    public getGameData(): GameEngineBase {

        return {
            firstPlayer: this.firstPlayer,
            score: this.score
        }
    }
}




export default GameEngine
