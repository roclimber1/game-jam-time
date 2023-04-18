
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


import Tree from './tree'
import Mushroom from './mushroom'

import Item from './item'
import Field from './field'
import Boulder from './boulder'



type RenderItemsParameters<Type> = {
    amount: number,
    item: Type
}



class Game {

    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera

    private renderer: THREE.WebGLRenderer


    private rayCaster: THREE.Raycaster
    private pointer: THREE.Vector2


    private controls: OrbitControls


    static zoom = 2


    constructor() {

        this.scene = new THREE.Scene()

        this.renderer = this.initRenderer()
        this.camera = this.initCamera()

        this.initLight()

        this.renderField()
        this.renderTrees()


        this.renderBoulders()


        this.rayCaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()

        this.initRayCaster()



        window.addEventListener('resize', () => {

            const { innerWidth, innerHeight } = window

            this.camera.aspect = innerWidth / innerHeight
            this.camera.updateProjectionMatrix()

            this.controls.update()


            this.renderer.setSize(innerWidth, innerHeight)
        })


        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.renderer.setAnimationLoop(this.render.bind(this))


        this.renderer.render(this.scene, this.camera)
    }


    public onPointerMove( event: MouseEvent ) {

        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }


    private previous: THREE.Object3D = null


    public render() {

        this.rayCaster.setFromCamera( this.pointer, this.camera )

        const intersects = this.rayCaster.intersectObjects( this.scene.children )


        if ( intersects.length > 0 ) {

            if (( this.previous != intersects[0].object ) && ( Field.groundUuid != intersects[0].object.uuid )) {


                if ( this.previous ) {

                    this.previous.material.emissive.setHex( this.previous.currentHex )
                }

                this.previous = intersects[0].object

                this.previous.currentHex = this.previous.material.emissive.getHex()
                this.previous.material.emissive.setHex( 0xff6969 )

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


    private initLight(): void {

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)

        this.scene.add(hemiLight)


        const initialDirLightPositionX = -100
        const initialDirLightPositionY = -100

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)

        dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200)
        dirLight.castShadow = true

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



        const backLight = new THREE.DirectionalLight(0x000000, .4)

        backLight.position.set(200, 200, 50)
        backLight.castShadow = true

        this.scene.add(backLight)
    }


    private getRandomSign(): number {

        return Math.round(Math.random()) ? 1 : -1
    }

    private getRandomPosition(value: number): number {

        const sign: number = this.getRandomSign()

        return Math.floor(sign * Math.random() * value)
    }


    private renderItems<Type extends Item>(parameters: RenderItemsParameters<Type>): void {

        const { amount, item } = parameters


        for (let i = 0; i < amount; i++) {

            const objectItem = item.render()

            objectItem.position.x = this.getRandomPosition(window.innerWidth)
            objectItem.position.y = this.getRandomPosition(window.innerHeight)

            this.scene.add(objectItem)
        }
    }


    private renderTrees(): void {

        const amount = 50


        this.renderItems({
            amount,
            item: new Tree(Game.zoom)
        })
    }


    private renderMushrooms(): void {

        const amount = 30


        this.renderItems({
            amount,
            item: new Mushroom(Game.zoom)
        })
    }


    private renderBoulders(): void {

        const amount = 100


        this.renderItems({
            amount,
            item: new Boulder(Game.zoom)
        })
    }


    public renderField(): void {

        const field: THREE.Group = new Field(Game.zoom).render()

        field.rotateZ(Math.PI / 3)

        this.scene.add(field)
    }

}



export default Game
