
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



import Tree from './tree'
import Mushroom from './mushroom'

import Item from './item'
import Field from './field'
import Boulder from './boulder'

import Color from './color'
import Unit from './unit'

import MiniGame from './minigame'

import GameEngine from './game_engine'
import GameBase from './game_base'


import Connector from './connector'

import { CUSTOM_EVENT } from '../constants'
import { ITEM } from '../../common/constants'



import type { GridCell } from '@/common/interfaces'
import type { GameEngineBase } from '../interfaces'




type RenderItemsParameters<Type> = {
    item: Type
}



class Game extends GameBase {

    private camera: THREE.PerspectiveCamera

    private renderer: THREE.WebGLRenderer


    private controls: OrbitControls

    private unit!: THREE.Group
    private opponent!: THREE.Group

    private miniGame: MiniGame | null = null
    private gameEngine: GameEngine

    private gameData: GameEngineBase


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


        this.initResizeListener()


        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.renderer.render(this.scene, this.camera)


        this.miniGame = new MiniGame()
        this.gameEngine = new GameEngine()

        this.gameData = this.gameEngine.getGameData()
    }


    private changeWaitingRoom(status: boolean): HTMLElement {

        const waitingRoomBlock: HTMLElement = document.getElementById('waiting-room') as HTMLElement

        if (status) {

            waitingRoomBlock?.classList.remove('invisible')
        } else {

            waitingRoomBlock?.classList.add('invisible')
        }


        return waitingRoomBlock
    }


    private initOpponent() {

        this.changeWaitingRoom(false)


        this.miniGame = null


        this.scene.add(this.opponent)

        this.initRayCaster(this.onPointerMove.bind(this))

        this.renderer.setAnimationLoop(this.animation.bind(this))
    }


    // const unitN1: THREE.Group = this.addUnit(Field.getStartTile(), Color.units[0])

    // this.addDirectionalLight(unitN1)


    // const unit: THREE.Group = this.addUnit(Field.getStartTile(-1), Color.units[1])


    private initEventListeners() {

        document.addEventListener(CUSTOM_EVENT.CONNECT, (event) => {


            const { data } = (event as CustomEvent)?.detail || {}
            const { currentTurnId } = data


            this.gameData.firstPlayer = this.gameEngine.updateFirstPlayer(this.connector.userId, currentTurnId)


            if (!this.mapInitialized) {

                this.unit = this.renderUnit(Field.getStartTile(-1), Color.units[1])
                this.opponent = this.renderUnit(Field.getStartTile(), Color.units[0])

                this.scene.add(this.unit)
            }

            this.connector.initMap({ grid: Field.grid })
        })



        document.addEventListener(CUSTOM_EVENT.WAITING, () => {

            const waitingRoomBlock: HTMLElement = this.changeWaitingRoom(true)


            waitingRoomBlock.innerHTML = ''


            const showScore: boolean = (this.gameData.score[GameEngine.yourIndex] > 0)
                || (this.gameData.score[GameEngine.opponentIndex] > 0)


            this.renderGameOverScreen({
                body: showScore ? `<div>Your score: ${this.gameData.score[GameEngine.yourIndex]}</div>
                <div>Your opponent's score: ${this.gameData.score[GameEngine.opponentIndex]}</div>` : '',
                buttonText: 'Start a new game 🕹️',
                element: waitingRoomBlock,
                icon: '🏆',
                startNewGame: () => window.location.reload(),
                text: 'Your opponent fled the battlefield 😶‍🌫️! Your tactic skills scared him away! You win!',
                title: 'You win!'
            })


            this.congratulations()

        })



        document.addEventListener(CUSTOM_EVENT.SET_MAP, (event) => {

            const { data } = (event as CustomEvent)?.detail || {}


            if (!this.mapInitialized) {

                this.renderMap(data)
                this.initOpponent()

                this.mapInitialized = true
            }
        })

    }


    private initResizeListener() {


        window.addEventListener('resize', () => {

            const { innerWidth, innerHeight } = window

            this.camera.aspect = innerWidth / innerHeight
            this.camera.updateProjectionMatrix()

            this.controls.update()


            this.renderer.setSize(innerWidth, innerHeight)
        })
    }


    public animation() {

        this.rayCaster.setFromCamera(this.pointer, this.camera)

        const intersects = this.rayCaster.intersectObjects(this.scene.children)


        if (intersects.length > 0) {

            if ((this.previous != intersects[0].object) && (Field.groundUuid != intersects[0].object.uuid)) {


                if (this.previous) {

                    this.previous.material.emissive.setHex(this.previous.currentHex)
                }

                this.previous = intersects[0].object

                const tile: GridCell = Field.getTileByUuid(intersects[0].object.uuid)


                this.previous.currentHex = this.previous.material.emissive.getHex()
                this.previous.material.emissive.setHex(Color.selection)
            }

        } else {

            if (this.previous) {

                this.previous.material.emissive.setHex(this.previous.currentHex)
            }

            this.previous = null

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


    private initCamera(): THREE.PerspectiveCamera {

        const camera: THREE.PerspectiveCamera = this.createCamera(35, 1, 10000, { x: 22, y: -2950, z: 1600 })


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

        grid.forEach((cell: GridCell) => {

            if (cell.occupied) {

                let item

                switch (cell.type) {

                    case ITEM.TREE:
                        item = new Tree(Game.zoom)

                        break

                    case ITEM.BOULDER:
                        item = new Boulder(Game.zoom)

                        break

                    case ITEM.MUSHROOM:
                        item = new Mushroom(Game.zoom)

                        break

                    default:

                        break
                }

                if (item) {

                    const objectItem = item.render()

                    objectItem.position.x = cell.centreX
                    objectItem.position.y = cell.centreY

                    this.scene.add(objectItem)
                }
            }
        })
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

        // this.addDirectionalLight(unit)

        return unit
    }


    public renderField(): void {

        const field: THREE.Group = new Field(Game.zoom).render()

        this.scene.add(field)
    }

}



export default Game
