
import { INIT_RESOURCES } from '../../common/constants'
import { CUSTOM_EVENT, TEXTS } from '../constants'



import type { GameEngineBase, Resources } from '../../common/interfaces'
import type { RenderGameOverScreenParameters } from '../interfaces'



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



    private getScoreData(): string {

        const showScore: boolean = (this.score[GameEngine.yourIndex] > 0)
            || (this.score[GameEngine.opponentIndex] > 0)

        const scoreData: string = showScore ? `<div>
                ${TEXTS.YOUR_SCORE}: ${this.score[GameEngine.yourIndex]}
            </div>

            <div>
                ${TEXTS.OPPONENT_SCORE}: ${this.score[GameEngine.opponentIndex]}
            </div>` : ''


        return scoreData
    }


    public checkIfYouWinner(): boolean {

        const youWinner: boolean = (this.score[GameEngine.yourIndex] > this.score[GameEngine.opponentIndex])

        return youWinner
    }


    public getMessages(event: CUSTOM_EVENT): Partial<RenderGameOverScreenParameters> {


        let parameters: Partial<RenderGameOverScreenParameters> = {}

        const youWinner: boolean = this.checkIfYouWinner()


        switch (event) {

            case CUSTOM_EVENT.OPPONENT_FLED:

                parameters = {
                    body: this.getScoreData(),
                    buttonText: TEXTS.START_NEW_GAME,
                    icon: '🏆',
                    startNewGame: () => window.location.reload(),
                    text: TEXTS.OPPONENT_FLED,
                    title: TEXTS.YOU_WIN
                }

                break

            case CUSTOM_EVENT.GAME_OVER_MOVES_LIMIT:

                parameters = {
                    body: this.getScoreData(),
                    buttonText: youWinner ? TEXTS.START_NEW_GAME : TEXTS.TRY_AGAIN,
                    icon: youWinner ? '🏆' : '🌀',
                    startNewGame: () => window.location.reload(),
                    text: youWinner ? TEXTS.YOU_WIN_POINTS : TEXTS.YOU_LOSE_POINTS,
                    title: TEXTS.GAME_OVER_MOVES_LIMIT
                }

                break
        }


        return parameters
    }
}




export default GameEngine
