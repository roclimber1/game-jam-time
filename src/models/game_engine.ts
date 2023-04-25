
import { ACTION } from '../../common/constants'
import { CUSTOM_EVENT, TEXTS } from '../constants'

import Color from '../../common/models/color'
import Field from './field'
import GameEngineAbstract from '../../common/models/game_engine_abstract'



import type { GameRoomBase, GridCell, Resources } from '../../common/interfaces'
import type { RenderGameOverScreenParameters } from '../interfaces'



class GameEngine extends GameEngineAbstract {

    public data!: GameRoomBase

    public score!: Array<number>
    public resources!: Array<Resources>

    public energy!: Array<number>
    public moves!: Array<number>


    public unitsPositions: Array<GridCell> = []


    public static yourIndex = 0
    public static opponentIndex = 1

    public firstPlayer = false


    constructor() {

        super()
    }



    public getInitColors() {

        let opponentColor: number = Color.units[0]
        let unitColor: number = Color.units[1]

        if (this.firstPlayer) {

            opponentColor = Color.units[1]
            unitColor = Color.units[0]
        }

        return [
            unitColor,
            opponentColor
        ]
    }


    public getInitPositions() {

        let opponentPosition: GridCell = Field.getStartTile(-1)
        let unitPosition: GridCell = Field.getStartTile()


        if (this.firstPlayer) {

            opponentPosition = Field.getStartTile()
            unitPosition = Field.getStartTile(-1)
        }


        this.unitsPositions = [
            unitPosition,
            opponentPosition
        ]

        return this.unitsPositions
    }


    public updateUnitPosition(cell: GridCell, isOpponent: boolean) {

        const index: number = isOpponent ? GameEngine.opponentIndex : GameEngine.yourIndex

        this.unitsPositions[index] = cell
    }


    public getUnitPosition(isOpponent: boolean): GridCell {

        const index: number = isOpponent ? GameEngine.opponentIndex : GameEngine.yourIndex

        return this.unitsPositions[index]
    }



    public getMyEnergy(): number {

        return this.energy[GameEngine.yourIndex]
    }


    public getMyScore(): number {

        return this.score[GameEngine.yourIndex]
    }


    public getMyMoves(): number {

        return this.moves[GameEngine.yourIndex]
    }


    public getMyResources(): Resources {

        return this.resources[GameEngine.yourIndex]
    }


    public checkActionAvailability(action: ACTION): boolean {

        const energy: number = this.getMyEnergy()
        const resources: Resources = this.getMyResources()


        return super.checkActionAvailability(action, energy, resources)
    }



    private getScoreData(): string {

        const myScore: number = this.getMyScore()
        const opponentScore: number = this.score[GameEngine.opponentIndex]


        const showScore: boolean = (myScore > 0)
            || (opponentScore > 0)


        const scoreData: string = showScore ? `<div>
                ${TEXTS.YOUR_SCORE}: ${myScore}
            </div>

            <div>
                ${TEXTS.OPPONENT_SCORE}: ${opponentScore}
            </div>` : ''


        return scoreData
    }


    public checkIfYouWinner(): Array<boolean> {

        const myScore: number = this.getMyScore()
        const opponentScore: number = this.score[GameEngine.opponentIndex]

        const youWinner: boolean = (myScore > opponentScore)
        const isDraw: boolean = (myScore == opponentScore)

        return [youWinner, isDraw]
    }


    public getMessages(event: CUSTOM_EVENT): Partial<RenderGameOverScreenParameters> {


        let parameters: Partial<RenderGameOverScreenParameters> = {}

        const [youWinner, isDraw] = this.checkIfYouWinner()

        const textDraw: string = (isDraw ? TEXTS.DRAW_POINTS : TEXTS.YOU_LOSE_POINTS)
        const text: string = (youWinner ? TEXTS.YOU_WIN_POINTS : textDraw)

        const iconDraw: string = (isDraw ? '🪅' : '🌀')
        const icon: string = youWinner ? '🏆' : iconDraw


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
                    icon,
                    startNewGame: () => window.location.reload(),
                    text,
                    title: TEXTS.GAME_OVER_MOVES_LIMIT
                }

                break
        }


        return parameters
    }
}




export default GameEngine
