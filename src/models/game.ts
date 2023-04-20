
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


import Tree from './tree'
import Mushroom from './mushroom'

import Item from './item'
import Field from './field'
import Boulder from './boulder'

import Color from './color'
import Tile from './tile'
import Unit from './unit'


import Connector from './connector'

import { CUSTOM_EVENT } from '../constants'



import type { GridCell } from '@/common/interfaces'




type RenderItemsParameters<Type> = {
    // amount: number,
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

        // const counterDOM = document.getElementById('score')


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

            this.connector.initMap({ grid: Field.grid })


            if (!this.mapInitialized) {

                this.unit = this.renderUnits()

                this.renderTrees()
                // this.renderMushrooms()
                this.renderBoulders()


                this.mapInitialized = true
            }
        })


        document.addEventListener(CUSTOM_EVENT.SET_MAP, (event) => {

            const { data } = (event as CustomEvent)?.detail || {}


            console.debug('🚀 ~ file: game.ts:124 ~ document.addEventListener ~ data:', data)
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

                // console.debug('🚀 ~ file: game.ts:120 ~ Game ~ render ~ intersects[0].object:', intersects[0].object.position)

                const tile: GridCell = Field.getTileByUuid(intersects[0].object.uuid)


                console.debug('🚀 ~ file: game.ts:134 ~ render ~ tile:', tile)


                this.previous.currentHex = this.previous.material.emissive.getHex()
                this.previous.material.emissive.setHex( Color.selection )
            }

        } else {

            if ( this.previous ) {

                this.previous.material.emissive.setHex( this.previous.currentHex )
            }

            this.previous = null

        }


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

        const distance = 500 * Game.zoom

        // const camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000 )

        const aspectRatio = window.innerWidth / window.innerHeight
        const camera = new THREE.PerspectiveCamera(35, aspectRatio, 1, 10000 )


        camera.rotation.x = 50 * Math.PI / 180
        camera.rotation.y = 20 * Math.PI / 180
        camera.rotation.z = 10 * Math.PI / 180

        const initialCameraPositionY = -Math.tan(camera.rotation.x) * distance
        const initialCameraPositionX = Math.tan(camera.rotation.y) * Math.sqrt(distance ** 2 + initialCameraPositionY ** 2)

        camera.position.y = initialCameraPositionY
        camera.position.x = initialCameraPositionX
        camera.position.z = distance

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


        // this.addDirectionalLight(this.unit)


        // const helper1 = new THREE.CameraHelper( dirLight.shadow.camera )
        // const helper2 = new THREE.CameraHelper( this.camera )

        // this.scene.add(helper1)
        // this.scene.add(helper2)


        const backLight = new THREE.DirectionalLight(0x000000, .4)

        backLight.position.set(200, 200, 50)
        backLight.castShadow = true

        this.scene.add(backLight)
    }


    private getRandomSign(): number {

        return Math.round(Math.random()) ? 1 : -1
    }

    // private getRandomPosition(value: number): number {

    //     const sign: number = this.getRandomSign()

    //     return Math.floor(sign * Math.random() * value)
    // }


    private renderItems<Type extends Item>(parameters: RenderItemsParameters<Type>): void {

        const { item } = parameters

        // amount,


        // for (let i = 0; i < amount; i++) {

        for (const i in Field.grid) {

            const gridCell: GridCell = Field.grid[i]

            const odds: boolean = (this.getRandomSign() + this.getRandomSign()) > 1


            if (odds && !gridCell.occupied) {

                const objectItem = item.render()

                objectItem.position.x = gridCell.centreX // + this.getRandomPosition(Tile.positionWidth / 2)
                objectItem.position.y = gridCell.centreY // + this.getRandomPosition(Tile.positionWidth / 2)

                Field.grid[i].occupied = true

                this.scene.add(objectItem)

            } else {

                // objectItem.position.x = this.getRandomPosition(window.innerWidth)
                // objectItem.position.y = this.getRandomPosition(window.innerHeight)
            }
        }
    }


    private renderTrees(): void {

        // const amount = 50


        this.renderItems({
            // amount,
            item: new Tree(Game.zoom)
        })
    }


    private renderMushrooms(): void {

        // const amount = 30


        this.renderItems({
            // amount,
            item: new Mushroom(Game.zoom)
        })
    }


    private renderBoulders(): void {

        // const amount = 100


        this.renderItems({
            // amount,
            item: new Boulder(Game.zoom)
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
