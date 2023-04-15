
import * as THREE from 'three'


import Color from './color'




class Tree {

    static threeHeights: Array<number> = [20, 30, 35, 40, 45, 55, 60, 70]
    static threeWidths: Array<number> = [25, 30, 35, 40, 45, 50]

    static trunkWidth = 10



    constructor(private zoom: number) {
        //
    }

    public render(): THREE.Group {

        const tree: THREE.Group = new THREE.Group()


        const trunk: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry( Tree.trunkWidth * this.zoom, Tree.trunkWidth * this.zoom, 20 * this.zoom ),
            new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
        )

        trunk.position.z = 10 * this.zoom
        trunk.castShadow = true
        trunk.receiveShadow = true

        tree.add(trunk)

        const height: number = Tree.threeHeights[Math.floor(Math.random() * Tree.threeHeights.length)]
        const width: number = Tree.threeWidths[Math.floor(Math.random() * Tree.threeWidths.length)]

        const color: number = Color.getRandomColor()


        const crown: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry( width * this.zoom, width * this.zoom, height * this.zoom ),
            new THREE.MeshLambertMaterial( { color, flatShading: true } )
        )

        crown.position.z = (height / 2 + 20) * this.zoom
        crown.castShadow = true
        crown.receiveShadow = false

        tree.add(crown)


        return tree
    }
}



export default Tree
