
import * as THREE from 'three'


import Color from './color'



class Tile {


    static positionWidth = 42
    static columns = 17

    static boardWidth: number = Tile.positionWidth * Tile.columns


    constructor(private zoom: number) {
        //
    }



    private createSection(color: number, ratio: number): THREE.Mesh {

        return new THREE.Mesh(
            new THREE.BoxBufferGeometry( Tile.boardWidth * this.zoom, Tile.positionWidth * this.zoom, ratio * this.zoom ),
            new THREE.MeshPhongMaterial( { color } )
        )
    }


    render(colors: Array<number> = Color.grass, ratio = 3): THREE.Group {

        const grass: THREE.Group = new THREE.Group()

        const color: number = Color.getRandomColor(colors)
        const middle: THREE.Mesh = this.createSection(color, ratio)

        middle.receiveShadow = true
        grass.add(middle)


        const left: THREE.Mesh = this.createSection(color, ratio)

        left.position.x = - Tile.boardWidth * this.zoom
        grass.add(left)

        const right: THREE.Mesh = this.createSection(color, ratio)

        right.position.x = Tile.boardWidth * this.zoom
        grass.add(right)

        grass.position.z = 1.5 * this.zoom


        return grass
    }
}



export default Tile
