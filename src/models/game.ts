
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



import Tree from './tree'
import Mushroom from './mushroom'
import Boulder from './boulder'

import Item from './item'
import Trap from './trap'
import Field from './field'


import Color from '../../common/models/color'
import Unit from './unit'

import MiniGame from './minigame'

import GameEngine from './game_engine'
import GameBase from './game_base'


import Connector from './connector'
import ControlPanel from './control_panel'


import { CUSTOM_EVENT, ICON } from '../constants'
import { ACTION, ITEM, ENERGY, SETTINGS, RESOURCE } from '../../common/constants'




import type { GridCell, GameEngineBase, TreeParameters, BoulderParameters, GameRoomBase, ActionData, Resources } from '@/common/interfaces'
import type { AddInfoBlockParameters, Position, RenderGameOverScreenParameters } from '../interfaces'




type RenderItemsParameters<Type> = {
    item: Type
}


type GameEventHandler = (event: Event) => void


type GameEventListeners = {
    handleClick: (event: MouseEvent) => void,
    handleGameAction: GameEventHandler,
    handleGameConnect: GameEventHandler,
    handleGameOpponentFled: GameEventHandler,
    handleGameOverMovesLimit: GameEventHandler,
    handleGameSetMap: GameEventHandler,
    handleGameTurn: GameEventHandler,
    handleMouseMove: (event: MouseEvent) => void
}


const defaultGameEventHandler: GameEventHandler = (event) => { /* * */ }


const gameEventListeners: GameEventListeners = {
    handleClick: (event: MouseEvent) => { /* * */ },
    handleGameAction: defaultGameEventHandler,
    handleGameConnect: defaultGameEventHandler,
    handleGameOpponentFled: defaultGameEventHandler,
    handleGameOverMovesLimit: defaultGameEventHandler,
    handleGameSetMap: defaultGameEventHandler,
    handleGameTurn: defaultGameEventHandler,
    handleMouseMove: (event: MouseEvent) => { /* * */ }
}



class Game extends GameBase {

    private camera: THREE.PerspectiveCamera

    private renderer: THREE.WebGLRenderer


    private controls!: OrbitControls

    private unit!: THREE.Group
    private opponent!: THREE.Group

    private miniGame: MiniGame | null = null
    private gameEngine: GameEngine

    private gameData: GameEngineBase
    private controlPanel: ControlPanel


    private selectedTile: GridCell | null = null


    private mapInitialized = false


    private previous: THREE.Object3D | null = null



    static zoom = 2


    constructor(private connector: Connector) {

        super()


        this.renderer = this.initRenderer()
        this.camera = this.initCamera()


        document.body.appendChild(this.renderer.domElement)


        this.initLight()


        this.renderField()

        this.initEventListeners()


        this.renderer.render(this.scene, this.camera)


        this.gameEngine = new GameEngine()

        this.gameData = this.gameEngine.getGameData()


        this.controlPanel = new ControlPanel(connector)

        this.controlPanel.hideProgressBarPanel()



        this.reInitRayCaster()

        window.onresize = () => this.resizeListener()
    }


    private reInitRayCaster() {

        this.initRayCaster(this.onPointerMove.bind(this))

        this.renderer.setAnimationLoop(this.animation.bind(this))
    }


    private initOpponent() {

        this.controlPanel.changeWaitingRoom(false)


        this.miniGame?.destroy()
        this.miniGame = null


        this.scene.add(this.opponent)
    }


    private removeItem(cell: GridCell) {

        this.scene.remove(cell.item as THREE.Object3D)

        Field.removeItemFromTile(cell)
    }


    private updateRightPanel(isOpponent: boolean) {

        let available: boolean = this.gameEngine.checkActionAvailability(ACTION.WOOD) && !isOpponent

        this.controlPanel.updateIcon(ICON.WOOD_GATHERING, !available)

        available = this.gameEngine.checkActionAvailability(ACTION.STONE) && !isOpponent

        this.controlPanel.updateIcon(ICON.STONE_GATHERING, !available)

        available = (this.gameEngine.checkActionAvailability(ACTION.MOVE_DIAGONAL)
            || this.gameEngine.checkActionAvailability(ACTION.MOVE_SIMPLE))
            && !isOpponent

        this.controlPanel.updateIcon(ICON.MOVE, !available)

        available = this.gameEngine.checkActionAvailability(ACTION.TRAP) && !isOpponent

        this.controlPanel.updateIcon(ICON.TRAP, !available)
    }


    private updateLeftPanel() {

        const resources: Resources = this.gameEngine.getMyResources()

        this.controlPanel.updateIcon(ICON.STONE, (resources[RESOURCE.STONE] == 0), resources[RESOURCE.STONE])

        this.controlPanel.updateIcon(ICON.WOOD, (resources[RESOURCE.WOOD] == 0), resources[RESOURCE.WOOD])
    }


    private updateEnergyBar() {

        const energy: number = this.gameEngine.getMyEnergy()

        this.controlPanel.updateEnergyCounter(energy)
    }



    private showGameOverScreen(isWinner = false, data: GameRoomBase, event: CUSTOM_EVENT) {

        this.gameEngine.updateGameData(data)


        const waitingRoomBlock: HTMLElement = this.controlPanel.changeWaitingRoom(true)


        waitingRoomBlock.innerHTML = ''


        const parameters: Partial<RenderGameOverScreenParameters> = this.gameEngine.getMessages(event)


        this.renderGameOverScreen({
            ...parameters,
            element: waitingRoomBlock
        } as RenderGameOverScreenParameters)


        this.controlPanel.gameOver()


        const [youWinner, isTie] = this.gameEngine.checkIfYouWinner()


        if (youWinner || isTie || isWinner) {

            this.congratulations()
        }


        this.removeEventListeners()
    }


    private clearBottomPanelTimeout: NodeJS.Timeout | null = null


    private removeEventListeners() {

        document.removeEventListener('mousemove', gameEventListeners.handleMouseMove)

        document.removeEventListener('click', gameEventListeners.handleClick)

        document.removeEventListener(CUSTOM_EVENT.TURN, gameEventListeners.handleGameTurn)

        document.removeEventListener(CUSTOM_EVENT.ACTION, gameEventListeners.handleGameAction)

        document.removeEventListener(CUSTOM_EVENT.CONNECT, gameEventListeners.handleGameConnect)

        document.removeEventListener(CUSTOM_EVENT.GAME_OVER_MOVES_LIMIT, gameEventListeners.handleGameOverMovesLimit)

        document.removeEventListener(CUSTOM_EVENT.OPPONENT_FLED, gameEventListeners.handleGameOpponentFled)

        document.removeEventListener(CUSTOM_EVENT.SET_MAP, gameEventListeners.handleGameSetMap)
    }


    private isOpponentTurn(id: string | null = null): boolean {

        const { currentTurnId } = this.gameEngine?.data || {}
        const userId: string = id ? id : currentTurnId

        const isOpponent: boolean = (userId != this.connector.userId)


        return isOpponent
    }


    private addTrap(tile: GridCell, isActive: boolean) {

        const trap: THREE.Mesh = new Trap(Game.zoom).render()

        trap.position.x = tile.centreX
        trap.position.y = tile.centreY

        tile.item = trap
        tile.occupied = false
        tile.type = ITEM.TRAP

        this.scene.add(trap)
    }


    private updateTrappedView(isOpponent: boolean, tile: GridCell) {

        const state: number = this.gameEngine.getUserTrappedState(isOpponent)


        if (state == SETTINGS.TRAP_TURNS) {

            this.addTrap(tile, true)

        } else if ((state == 0) && (tile.type == ITEM.TRAP)) {

            this.removeItem(tile)
        }
    }


    private getAvailabilityBlock(available: boolean) {

        return (availabilityText: string) => (baseText: string): string => {

            let block = `<div class="text-lime-700">${baseText}</div>`


            if (!available) {

                block = `<div class="text-orange-700">
                    ${availabilityText}
                </div>`
            }

            return block
        }
    }


    private getPointsInfoBlock(energy: ENERGY) {

        return `<div>
            You need <span class="text-indigo-500">${energy} points of energy</span>
        </div>`
    }


    private mousePosition!: Position


    private initEventListeners() {


        gameEventListeners.handleMouseMove = (event: MouseEvent) => {

            const { clientX, clientY } = event

            this.mousePosition = {
                clientX,
                clientY
            }


            if (this.selectedTile) {

                const unitPosition: GridCell = this.gameEngine.getUnitPosition(false)
                const { distance, nearest: nearestTile } = Field.getDistanceBetweenTiles([this.selectedTile, unitPosition])


                const isOpponent = this.isOpponentTurn()

                let parameters: AddInfoBlockParameters | null = null
                let available: boolean

                let availabilityText: string = (isOpponent ? 'It isn\'t available now. Wait for your turn' : 'You have not enough energy')


                const baseParameters: Partial<AddInfoBlockParameters> = {
                    autoRemove: false,
                    className: 'flex-col'
                }


                if (!this.selectedTile.occupied) {

                    const baseText = 'You could do it'


                    if (nearestTile) {

                        const stepType: ACTION = this.gameEngine.getStepType(distance)
                        const energy: ENERGY = (stepType == ACTION.MOVE_SIMPLE) ? ENERGY.MOVE_SIMPLE : ENERGY.MOVE_DIAGONAL

                        available = this.gameEngine.checkActionAvailability(stepType) && !isOpponent

                        parameters = {
                            ...baseParameters,
                            text: `<div>
                                    You could move here
                                </div>

                                ${this.getPointsInfoBlock(energy)}

                                ${this.getAvailabilityBlock(available)(availabilityText)(baseText)}
                                `
                        } as AddInfoBlockParameters

                    } else {

                        available = this.gameEngine.checkActionAvailability(ACTION.TRAP) && !isOpponent

                        parameters = {
                            ...baseParameters,
                            text: `<div>
                                    You could create a trap for your opponent
                                </div>

                                ${this.getPointsInfoBlock(ENERGY.TRAP)}

                                ${this.getAvailabilityBlock(available)(availabilityText)(baseText)}
                                `
                        } as AddInfoBlockParameters
                    }
                } else {

                    const baseText = 'You could gather it'

                    availabilityText = nearestTile ? availabilityText : 'You couldn\'t reach it'


                    switch (this.selectedTile.type) {

                        case ITEM.BOULDER:

                            available = this.gameEngine.checkActionAvailability(ACTION.STONE) && !isOpponent && nearestTile

                            parameters = {
                                ...baseParameters,
                                text: `<div>
                                        You could gather 1 stone (+1 🪨)
                                    </div>

                                    ${this.getPointsInfoBlock(ENERGY.STONE)}

                                    ${this.getAvailabilityBlock(available)(availabilityText)(baseText)}
                                    `
                            } as AddInfoBlockParameters

                            break

                        case ITEM.TREE:

                            available = this.gameEngine.checkActionAvailability(ACTION.WOOD) && !isOpponent && nearestTile

                            parameters = {
                                ...baseParameters,
                                text: `<div>
                                        You could gather 1 wood (+1 🪵)
                                    </div>

                                    ${this.getPointsInfoBlock(ENERGY.WOOD)}

                                    ${this.getAvailabilityBlock(available)(availabilityText)(baseText)}
                                    `
                            } as AddInfoBlockParameters

                            break
                    }
                }


                if (parameters) {

                    this.controlPanel.updateBottomPanel(parameters)
                }

            }

            this.clearBottomPanelTimeout && clearTimeout(this.clearBottomPanelTimeout)

            this.clearBottomPanelTimeout = setTimeout(() => this.controlPanel.clearBottomPanel(), 5000)
        }


        document.addEventListener('mousemove', gameEventListeners.handleMouseMove)


        gameEventListeners.handleClick = (event: MouseEvent) => {

            if (this.isOpponentTurn()) {

                return
            }


            if (this.selectedTile) {

                const unitPosition: GridCell = this.gameEngine.getUnitPosition(false)
                const { distance, nearest: nearestTile } = Field.getDistanceBetweenTiles([this.selectedTile, unitPosition])


                let available = false
                let action: ACTION = ACTION.NONE



                if (!this.selectedTile.occupied) {


                    if (nearestTile) {

                        action = this.gameEngine.getStepType(distance)

                    } else {

                        action = ACTION.TRAP
                    }

                } else {

                    if (nearestTile) {

                        switch (this.selectedTile.type) {

                            case ITEM.BOULDER:

                                action = ACTION.STONE

                                break

                            case ITEM.TREE:


                                action = ACTION.WOOD

                                break
                        }
                    }
                }

                if (action != ACTION.NONE) {

                    available = this.gameEngine.checkActionAvailability(action)
                }

                if (available) {

                    this.connector.sendAction({
                        id: this.connector.userId,
                        position: this.selectedTile,
                        type: action
                    })
                }
            }
        }

        document.addEventListener('click', gameEventListeners.handleClick)


        gameEventListeners.handleGameTurn = (event: Event) => {

            const { data } = (event as CustomEvent)?.detail || {}
            const { movesCounter } = data as GameRoomBase

            this.gameEngine.updateGameData(data)


            const isOpponent: boolean = this.isOpponentTurn()


            this.controlPanel.startTimer(isOpponent)
            this.controlPanel.updateMovesCounter(movesCounter)


            this.updateRightPanel(isOpponent)

            this.updateLeftPanel()
            this.updateEnergyBar()
        }


        document.addEventListener(CUSTOM_EVENT.TURN, gameEventListeners.handleGameTurn)


        gameEventListeners.handleGameAction = (event: Event) => {

            const { data } = (event as CustomEvent)?.detail || {}
            const { actionData, roomData } = data as ActionData

            const { id, position, type } = actionData
            const { centreX, centreY } = position

            this.gameEngine.updateGameData(roomData)


            const isOpponent: boolean = this.isOpponentTurn(id)
            const unit = isOpponent ? this.opponent : this.unit

            let infoBlockParameters: Partial<AddInfoBlockParameters> = {
                position: this.mousePosition
            }


            const tile: GridCell = Field.getTileByUuid(position.id)
            const previousTile: GridCell = Field.getTileByCentrePosition(unit)

            // TODO: trap logic


            this.updateRightPanel(isOpponent)

            this.updateLeftPanel()
            this.updateEnergyBar()


            switch (type) {

                case ACTION.MOVE_DIAGONAL:

                    // break omitted intentionally

                case ACTION.MOVE_SIMPLE:

                    unit.position.set(centreX, centreY, unit.position.z)

                    tile.occupied = true
                    tile.type = ITEM.UNIT

                    Field.removeItemFromTile(previousTile)

                    infoBlockParameters = {
                        ...infoBlockParameters,
                        text: `⚡-${(type == ACTION.MOVE_SIMPLE) ? ENERGY.MOVE_SIMPLE : ENERGY.MOVE_DIAGONAL}`
                    }

                    this.gameEngine.updateUnitPosition(tile, isOpponent)

                    break

                case ACTION.STONE:

                    this.removeItem(tile)

                    infoBlockParameters = {
                        ...infoBlockParameters,
                        text: `🪨+1 ⚡-${ENERGY.STONE}`
                    }

                    break

                case ACTION.WOOD:

                    this.removeItem(tile)

                    infoBlockParameters = {
                        ...infoBlockParameters,
                        text: `🪵+1 ⚡-${ENERGY.WOOD}`
                    }

                    break

                case ACTION.TRAP:

                    this.addTrap(tile, false)

                    infoBlockParameters = {
                        ...infoBlockParameters,
                        text: `🪵-${SETTINGS.TRAP_WOOD} 🪨-${SETTINGS.TRAP_STONE} ⚡-${ENERGY.TRAP}`
                    }

                    break
            }

            if (infoBlockParameters) {

                this.controlPanel.addHoveringInfoBlock(infoBlockParameters as AddInfoBlockParameters)
            }
        }


        document.addEventListener(CUSTOM_EVENT.ACTION, gameEventListeners.handleGameAction)



        gameEventListeners.handleGameConnect = (event: Event) => {

            const { data } = (event as CustomEvent)?.detail || {}
            const { currentTurnId, players } = data as GameRoomBase

            this.gameEngine.updateIndexData(players, this.connector.userId)
            this.gameEngine.updateGameData(data)


            this.gameData.firstPlayer = this.gameEngine.updateFirstPlayer(this.connector.userId, currentTurnId)


            if (!this.mapInitialized) {

                const [unitPosition, opponentPosition] = this.gameEngine.getInitPositions()
                const [unitColor, opponentColor] = this.gameEngine.getInitColors()

                this.unit = this.renderUnit(unitPosition, unitColor)
                this.opponent = this.renderUnit(opponentPosition, opponentColor)


                this.addDirectionalLight()

                this.scene.add(this.unit)
            }

            this.connector.initMap({ grid: Field.grid })
        }


        document.addEventListener(CUSTOM_EVENT.CONNECT, gameEventListeners.handleGameConnect)



        gameEventListeners.handleGameOverMovesLimit = (event: Event) => {

            const { data } = (event as CustomEvent)?.detail || {}

            this.showGameOverScreen(false, data as GameRoomBase, CUSTOM_EVENT.GAME_OVER_MOVES_LIMIT)
        }


        document.addEventListener(CUSTOM_EVENT.GAME_OVER_MOVES_LIMIT, gameEventListeners.handleGameOverMovesLimit)




        gameEventListeners.handleGameOpponentFled = (event: Event) => {

            const { data } = (event as CustomEvent)?.detail || {}
            const { isOver } = data


            if (!isOver) {

                this.showGameOverScreen(true, data as GameRoomBase, CUSTOM_EVENT.OPPONENT_FLED)
            }
        }


        document.addEventListener(CUSTOM_EVENT.OPPONENT_FLED, gameEventListeners.handleGameOpponentFled)



        gameEventListeners.handleGameSetMap = (event: Event) => {

            const { data } = (event as CustomEvent)?.detail || {}


            if (!this.mapInitialized) {

                this.renderMap(data)


                if (!this.gameData.firstPlayer) {

                    this.camera.position.set(22, 2950, 1600)
                    this.camera.up.set(0, -1, 0)


                    this.resizeListener()
                }


                this.initOpponent()


                this.controlPanel.showProgressBarPanel()


                this.mapInitialized = true


                if (this.gameData.firstPlayer) {

                    this.connector.mapInitialized()
                }
            }
        }


        document.addEventListener(CUSTOM_EVENT.SET_MAP, gameEventListeners.handleGameSetMap)

    }



    private resizeListener() {

        const { innerWidth, innerHeight } = window

        this.camera.aspect = innerWidth / innerHeight
        this.camera.updateProjectionMatrix()


        this.controls.update()


        this.renderer.setSize(innerWidth, innerHeight)

        this.reInitRayCaster()
    }


    public animation() {

        const { isOver } = this.gameEngine?.data || {}
        const condition: boolean = isOver

        if (condition) {

            return
        }


        this.rayCaster.setFromCamera(this.pointer, this.camera)

        const intersects = this.rayCaster.intersectObjects(this.scene.children)


        if (intersects.length > 0) {

            if ((this.previous != intersects[0].object) && (Field.groundUuid != intersects[0].object.uuid)) {


                if (this.previous) {

                    this.previous.material.emissive.setHex(this.previous.currentHex)
                }

                this.previous = intersects[0].object


                this.selectedTile = Field.getTileByUuid(this.previous.uuid)


                if (!this.selectedTile) {

                    let item: THREE.Object3D = this.previous


                    if (!item.position.x && !item.position.y) {

                        item = this.previous.parent as THREE.Object3D
                    }

                    this.selectedTile = Field.getTileByCentrePosition(item)
                }


                this.previous.currentHex = this.previous.material.emissive.getHex()

                const available: boolean = this.gameEngine.checkIfAnyActionAvailable()
                const color: number = (available ? Color.selection.available : Color.selection.unavailable)

                this.previous.material.emissive.setHex(color)
            }

        } else {

            if (this.previous) {

                this.previous.material.emissive.setHex(this.previous.currentHex)
            }

            this.previous = null
            this.selectedTile = null

        }


        this.renderer.render(this.scene, this.camera)
    }



    private initRenderer(): THREE.WebGLRenderer {

        const renderer: THREE.WebGLRenderer = this.createRenderer(
            {
                alpha: true,
                antialias: true
            },
            (renderer: THREE.WebGLRenderer) => {

                renderer.shadowMap.enabled = true
                renderer.shadowMap.type = THREE.PCFSoftShadowMap
            }
        )


        return renderer
    }


    private initCamera(position: THREE.Vector3 = new THREE.Vector3(22, -2950, 1600)): THREE.PerspectiveCamera {

        const camera: THREE.PerspectiveCamera = this.createCamera(35, 1, 10000, position)


        this.controls = new OrbitControls(camera, this.renderer.domElement)

        return camera
    }



    private getRandomSign(): number {

        return Math.round(Math.random()) ? 1 : -1
    }



    private renderItems<Type extends Item>(parameters: RenderItemsParameters<Type>): void {

        const { item } = parameters


        for (const i in Field.grid) {

            const gridCell: GridCell = Field.grid[i]

            const odds: boolean = (this.getRandomSign() + this.getRandomSign()) > 1


            if (odds && !gridCell.occupied) {

                const objectItem = item.render()

                objectItem.position.x = gridCell.centreX
                objectItem.position.y = gridCell.centreY

                Field.grid[i].occupied = true

                this.scene.add(objectItem)

            }
        }
    }


    private renderTrees(): void {

        this.renderItems({
            item: new Tree(Game.zoom)
        })
    }


    private renderMushrooms(): void {

        this.renderItems({
            item: new Mushroom(Game.zoom)
        })
    }


    private renderBoulders(): void {

        this.renderItems({
            item: new Boulder(Game.zoom)
        })
    }



    private renderMap(grid: Array<GridCell>) {


        grid.forEach((cell: GridCell, index: number) => {

            if (cell.occupied) {

                let item
                let parameters
                let itemArguments: Array<number> = []


                switch (cell.type) {

                    case ITEM.TREE:

                        item = new Tree(Game.zoom)
                        parameters = cell.parameters as TreeParameters

                        itemArguments = [parameters.width, parameters.height, parameters.color]

                        break

                    case ITEM.BOULDER:

                        item = new Boulder(Game.zoom)
                        parameters = cell.parameters as BoulderParameters

                        itemArguments = [parameters.width, parameters.segments, parameters.color]

                        break

                    case ITEM.MUSHROOM:
                        item = new Mushroom(Game.zoom)

                        break

                    default:

                        break
                }

                if (item) {

                    const objectItem = item.render(...itemArguments)

                    objectItem.position.x = cell.centreX
                    objectItem.position.y = cell.centreY


                    grid[index].item = objectItem

                    this.scene.add(objectItem)
                }
            }
        })


        Field.updateGrid(grid)
    }


    private addUnit(gridCell: GridCell, color: number): THREE.Group {

        const unit: THREE.Group = new Unit(Game.zoom).render({ color })

        unit.position.x = gridCell?.centreX
        unit.position.y = gridCell?.centreY

        gridCell.occupied = true


        return unit
    }


    public renderUnit(cell: GridCell, color: number): THREE.Group {

        const unit: THREE.Group = this.addUnit(cell, color)

        return unit
    }


    public renderField(): void {

        const field: THREE.Group = new Field(Game.zoom).render()

        this.scene.add(field)
    }

}



export default Game
