
import * as THREE from 'three'


import Item from './item'





class Tree extends Item {

    static trunkWidth = 10



    public render(width: number = this.getRandomWidth(), height: number = this.getRandomHeight(), color: number = this.getRandomColor()): THREE.Group {

        const tree: THREE.Group = new THREE.Group()


        const trunk: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry( Tree.trunkWidth * this.zoom, Tree.trunkWidth * this.zoom, 20 * this.zoom ),
            new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
        )

        trunk.position.z = 10 * this.zoom
        trunk.castShadow = true
        trunk.receiveShadow = true

        tree.add(trunk)


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
