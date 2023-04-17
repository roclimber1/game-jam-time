
import * as THREE from 'three'


import Tree from './tree'
import Item from './item'





class Mushroom extends Item {



    public render(): THREE.Group {

        const mushroom: THREE.Group = new THREE.Group()


        const trunk: THREE.Mesh = new THREE.Mesh(
            new THREE.CylinderGeometry( Tree.trunkWidth * this.zoom, Tree.trunkWidth * this.zoom, 20 * this.zoom ),
            new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
        )

        trunk.position.z = 10 * this.zoom
        trunk.rotation.x = Math.PI / 2
        trunk.castShadow = true
        trunk.receiveShadow = true

        mushroom.add(trunk)

        const height: number = this.getRandomHeight()
        const width: number = this.getRandomWidth()

        const color: number = this.getRandomColor()


        const crown: THREE.Mesh = new THREE.Mesh(
            new THREE.CylinderGeometry( width * this.zoom, width * this.zoom, height * this.zoom ),
            new THREE.MeshLambertMaterial( { color, flatShading: true } )
        )

        crown.position.z = (height / 2 + 20) * this.zoom
        crown.rotation.x = Math.PI / 2
        crown.castShadow = true
        crown.receiveShadow = false

        mushroom.add(crown)


        return mushroom
    }
}



export default Mushroom
