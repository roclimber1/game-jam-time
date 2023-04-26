
import { ACTION, ENERGY, INIT_RESOURCES, SETTINGS } from '../../common/constants'



import type { GameEngineBase, GameRoomBase, GridCell, Resources } from '../../common/interfaces'



class GameEngineAbstract implements GameEngineBase {

    public data!: GameRoomBase

    public score!: Array<number>
    public resources!: Array<Resources>

    public energy!: Array<number>
    public moves!: Array<number>

    public traps!: Array<Array<GridCell>>
    public trapped!: Array<number>


    public unitsPositions: Array<GridCell> = []
    public trapsPositions: Array<GridCell> = []


    public firstPlayer = false


    constructor() {

        this.init()
    }


    public init() {

        this.score = [0,0]
        this.resources = [{ ...INIT_RESOURCES }, { ...INIT_RESOURCES }]

        this.energy = [SETTINGS.ENERGY, SETTINGS.ENERGY]
        this.moves = [SETTINGS.TURN_MOVES, SETTINGS.TURN_MOVES]

        this.traps = [[], []]
        this.trapped = [0,0]


        this.firstPlayer = false
    }


    public updateFirstPlayer(id: string, firstId: string): boolean {

        this.firstPlayer = (id == firstId)

        return this.firstPlayer
    }


    public getGameData(): GameEngineBase {

        return {
            energy: this.energy,
            firstPlayer: this.firstPlayer,
            moves: this.moves,
            resources: this.resources,
            score: this.score,
            trapped: this.trapped,
            traps: this.traps
        }
    }


    public updateGameData(data: GameRoomBase) {

        const { gameData } = data
        const { score, resources, energy, moves, trapped, traps } = gameData

        this.score = score
        this.resources = resources

        this.energy = energy
        this.moves = moves

        this.trapped = trapped
        this.traps = traps

        this.data = data
    }



    public checkActionAvailability(action: ACTION, energy: number, resources: Resources): boolean {

        let state!: boolean


        switch (action) {

            case ACTION.STONE:

                state = (energy >= ENERGY.STONE)

                break

            case ACTION.WOOD:

                state = (energy >= ENERGY.WOOD)

                break

            case ACTION.TRAP:

                state = (energy >= ENERGY.TRAP)
                    && (resources.stone >= SETTINGS.TRAP_STONE)
                    && (resources.wood >= SETTINGS.TRAP_WOOD)

                break

            case ACTION.MOVE_DIAGONAL:

                state = (energy >= ENERGY.MOVE_DIAGONAL)

                break

            case ACTION.MOVE_SIMPLE:

                state = (energy >= ENERGY.MOVE_SIMPLE)

                break

            default:

                state = false
        }

        return state
    }


}




export default GameEngineAbstract
