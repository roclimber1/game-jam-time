
import * as THREE from 'three'


import Item from './item'




class Tree extends Item {

    static threeHeights: Array<number> = [20, 30, 35, 40, 45, 55, 60, 70]
    static threeWidths: Array<number> = [25, 30, 35, 40, 45, 50]

    static trunkWidth = 10



    public render(): THREE.Group {

        const tree: THREE.Group = new THREE.Group()


        const trunk: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry( Tree.trunkWidth * this.zoom, Tree.trunkWidth * this.zoom, 20 * this.zoom ),
            new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
        )

        trunk.position.z = 10 * this.zoom
        trunk.castShadow = true
        trunk.receiveShadow = true

        tree.add(trunk)

        const height: number = this.getRandomHeight()
        const width: number = this.getRandomWidth()

        const color: number = this.getRandomColor()


        const crown: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry( width * this.zoom, width * this.zoom, height * this.zoom ),
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
