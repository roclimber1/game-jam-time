
import * as THREE from 'three'


import Tree from './tree'
import Tile from './tile'

import Color from './color'



class Game {

    private scene: THREE.Scene
    private camera: THREE.OrthographicCamera

    private renderer: THREE.WebGLRenderer


    static zoom = 2


    constructor() {

        // const counterDOM = document.getElementById('score')


        this.scene = new THREE.Scene()

        this.renderer = this.initRenderer()
        this.camera = this.initCamera()

        this.initLight()

        this.renderField()
        this.renderTrees()


        this.renderer.render(this.scene, this.camera)
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


    private initCamera(): THREE.OrthographicCamera {

        const distance = 500

        const camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000 )

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
        // dirLight.target = unit

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


    private renderTrees(): void {

        const amount = 50


        for (let i = 0; i < amount; i++) {

            const tree = new Tree(Game.zoom).render()

            tree.position.x = this.getRandomPosition(window.innerWidth)
            tree.position.y = this.getRandomPosition(window.innerHeight)

            this.scene.add(tree)
        }
    }


    public renderField(): void {

        [-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9].map((index) => {


            const sign: number = this.getRandomSign()


            const isGrass = (sign > 0)

            const colors = isGrass ? undefined : Color.tiles
            const ratio = isGrass ? undefined : 1

            const tile = new Tile(Game.zoom).render(colors, ratio)

            tile.position.y = index * Tile.positionWidth * Game.zoom

            this.scene.add( tile )

        })

    }

}



export default Game
