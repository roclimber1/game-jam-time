
import * as THREE from 'three'


import Color from '../../common/models/color'
import Item from './item'
import Tile from './tile'



class Trap extends Item {

    static width = Math.round(Tile.positionWidth * 0.75)

    static height = 10
    static activeHeight = 55



    public render(active = false): THREE.Mesh {

        const color: number = Color.selection.unavailable
        const height: number = active ? Trap.activeHeight : Trap.height

        const item: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Trap.width * this.zoom, Trap.width * this.zoom, height * this.zoom),
            new THREE.MeshPhongMaterial({ color })
        )


        return item
    }
}



export default Trap
