
import * as THREE from 'three'


import Color from '../../common/models/color'
import Item from './item'


import { BOULDER_SEGMENTS, BOULDER_WIDTHS } from '../../common/constants'




class Boulder extends Item {

    private widths: Array<number> = BOULDER_WIDTHS
    private segments: Array<number> = BOULDER_SEGMENTS

    private angles: Array<number> = [2, 3, 4, 5, 6]


    render(width: number = this.getRandomWidth(this.widths), segments: number = this.getRandom(this.segments), color: number = this.getRandomColor(Color.boulders)): THREE.Mesh {

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
