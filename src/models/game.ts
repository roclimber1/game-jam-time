
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


import Tree from './tree'
import Mushroom from './mushroom'

import Item from './item'
import Field from './field'
import Boulder from './boulder'

import Color from './color'
import Unit from './unit'


import Connector from './connector'

import { CUSTOM_EVENT } from '../constants'
import { ITEM } from '../../common/constants'



import type { GridCell } from '@/common/interfaces'




type RenderItemsParameters<Type> = {
    item: Type
}



class Game {

    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera

    private renderer: THREE.WebGLRenderer


    private rayCaster!: THREE.Raycaster
    private pointer!: THREE.Vector2


    private controls: OrbitControls

    private unit!: THREE.Group

    private mapInitialized = false


    private previous: THREE.Object3D | null = null



    static zoom = 2


    constructor(private connector: Connector) {

        this.scene = new THREE.Scene()

        this.renderer = this.initRenderer()
        this.camera = this.initCamera()


        this.initLight()


        this.renderField()

        this.initMap()


        this.initRayCaster()

        this.initResizeListener()


        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.renderer.setAnimationLoop(this.render.bind(this))

        this.renderer.render(this.scene, this.camera)
    }


    private initMap() {

        document.addEventListener(CUSTOM_EVENT.CONNECT, () => {

            if (!this.mapInitialized) {

                this.unit = this.renderUnits()
            }

            this.connector.initMap({ grid: Field.grid })
        })


        document.addEventListener(CUSTOM_EVENT.SET_MAP, (event) => {

            const { data } = (event as CustomEvent)?.detail || {}


            if (!this.mapInitialized) {

                this.renderMap(data)

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


    public onPointerMove( event: MouseEvent ) {

        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }


    public render() {

        this.rayCaster.setFromCamera( this.pointer, this.camera )

        const intersects = this.rayCaster.intersectObjects( this.scene.children )


        if ( intersects.length > 0 ) {

            if (( this.previous != intersects[0].object ) && ( Field.groundUuid != intersects[0].object.uuid )) {


                if ( this.previous ) {

                    this.previous.material.emissive.setHex( this.previous.currentHex )
                }

                this.previous = intersects[0].object

                const tile: GridCell = Field.getTileByUuid(intersects[0].object.uuid)


                this.previous.currentHex = this.previous.material.emissive.getHex()
                this.previous.material.emissive.setHex( Color.selection )
            }

        } else {

            if ( this.previous ) {

                this.previous.material.emissive.setHex( this.previous.currentHex )
            }

            this.previous = null

        }


        console.debug('🚀 ~ file: game.ts:182 ~ Game ~ render ~ this.camera:', this.camera)


        this.renderer.render( this.scene, this.camera )
    }


    private initRayCaster() {

        this.rayCaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()

        const onPointerMove = (event: MouseEvent) => this.onPointerMove(event)

        addEventListener( 'mousemove', onPointerMove )
    }


    private initRenderer(): THREE.WebGLRenderer {

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })


        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        renderer.setSize( window.innerWidth, window.innerHeight )

        document.body.appendChild( renderer.domElement )


        return renderer
    }


    private initCamera(): THREE.PerspectiveCamera {

        const aspectRatio = window.innerWidth / window.innerHeight
        const camera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 10000 )


        camera.rotation.x = 50 * Math.PI / 180
        camera.rotation.y = 20 * Math.PI / 180
        camera.rotation.z = 10 * Math.PI / 180


        camera.position.x = 22
        camera.position.y = -2950
        camera.position.z = 1600

        return camera
    }


    private addDirectionalLight(target: THREE.Object3D): void {

        const initialDirLightPositionX = -100
        const initialDirLightPositionY = -100

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)

        dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200)
        dirLight.castShadow = true
        dirLight.target = target

        this.scene.add(dirLight)


        dirLight.shadow.mapSize.width = 2048
        dirLight.shadow.mapSize.height = 2048
        const d = 500

        dirLight.shadow.camera.left = - d
        dirLight.shadow.camera.right = d
        dirLight.shadow.camera.top = d
        dirLight.shadow.camera.bottom = - d


        dirLight.position.x = initialDirLightPositionX
        dirLight.position.y = initialDirLightPositionY
    }


    private initLight(): void {

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)

        this.scene.add(hemiLight)


        const backLight = new THREE.DirectionalLight(0x000000, .4)

        backLight.position.set(200, 200, 50)
        backLight.castShadow = true

        this.scene.add(backLight)
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

        this.scene.add(unit)


        return unit
    }


    public renderUnits(): THREE.Group {

        const unitN1: THREE.Group = this.addUnit(Field.getStartTile(), Color.units[0])

        this.addDirectionalLight(unitN1)



        const unitN2: THREE.Group = this.addUnit(Field.getStartTile(-1), Color.units[1])

        this.addDirectionalLight(unitN2)

        return unitN2
    }


    public renderField(): void {

        const field: THREE.Group = new Field(Game.zoom).render()

        this.scene.add(field)
    }

}



export default Game
