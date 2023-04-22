
import * as THREE from 'three'

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'




class GameBase {

    public scene!: THREE.Scene


    public rayCaster!: THREE.Raycaster
    public pointer!: THREE.Vector2



    constructor() {

        this.scene = new THREE.Scene()
    }



    public createRenderer = (
        rendererProps = {},
        configureRenderer = (renderer: THREE.WebGLRenderer) => {}
    ) => {

        const renderer = new THREE.WebGLRenderer(rendererProps)
        const { innerWidth, innerHeight, devicePixelRatio } = window

        renderer.setPixelRatio(devicePixelRatio)
        renderer.setSize(innerWidth, innerHeight)


        configureRenderer(renderer)


        return renderer
    }



    public createComposer = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, extraPasses) => {

        const renderScene = new RenderPass(scene, camera)
        const composer = new EffectComposer(renderer)

        composer.addPass(renderScene)


        extraPasses(composer)

        return composer
    }


    public createCamera = (
        fov = 45,
        near = 0.1,
        far = 100,
        camPos = { x: 0, y: 0, z: 5 },
        camLookAt = { x: 0, y: 0, z: 0 },
        aspect = window.innerWidth / window.innerHeight
    ) => {
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

        camera.position.set(camPos.x, camPos.y, camPos.z)
        camera.lookAt(camLookAt.x, camLookAt.y, camLookAt.z)

        camera.updateProjectionMatrix()

        return camera
    }


    public addDirectionalLight(target: THREE.Object3D | null = null): void {

        const initialDirLightPositionX = -100
        const initialDirLightPositionY = -100

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)

        dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200)
        dirLight.castShadow = true

        if (target) {

            dirLight.target = target
        }

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


    public initLight(): void {

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)

        this.scene.add(hemiLight)

        this.addDirectionalLight()

        const backLight = new THREE.DirectionalLight(0x000000, .4)

        backLight.position.set(200, 200, 50)
        backLight.castShadow = true

        this.scene.add(backLight)
    }


    public initRayCaster(onPointerMove: (event: MouseEvent) => void) {

        this.rayCaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()

        addEventListener('mousemove', onPointerMove)
    }


    public onPointerMove(event: MouseEvent) {

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1
    }

}





export default GameBase
