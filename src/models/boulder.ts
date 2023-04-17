
import * as THREE from 'three'


import Color from './color'
import Item from './item'



class Boulder extends Item {

    private widths: Array<number> = [5, 7, 10, 13, 15, 17, 19]
    private segments: Array<number> = [4, 6, 8]

    private angles: Array<number> = [2, 3, 4, 5, 6]


    render(): THREE.Mesh {

        const width: number = this.getRandomWidth(this.widths)
        const segments: number = this.getRandom(this.segments)

        const color: number = this.getRandomColor(Color.boulders)

        const boulder: THREE.Mesh = new THREE.Mesh(
            new THREE.SphereGeometry( width * this.zoom, segments, segments ),
            new THREE.MeshPhongMaterial( { color, flatShading: true } )
        )

        boulder.position.z = (width * this.zoom) / this.getRandom(this.angles)

        boulder.rotation.z = this.getRandomSign() * Math.PI / this.getRandom(this.angles)

        boulder.rotation.y = this.getRandomSign() * Math.PI / this.getRandom(this.angles)
        boulder.rotation.x = this.getRandomSign() * Math.PI / this.getRandom(this.angles)

        boulder.castShadow = true
        boulder.receiveShadow = true


        return boulder
    }
}



export default Boulder
