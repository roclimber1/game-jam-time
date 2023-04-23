
import * as THREE from 'three'


import Color from '../../common/models/color'
import Item from './item'



class Tile extends Item {

    static positions: Array<number> = [-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9]

    static lastIndex: number = Math.abs(Tile.positions[0])

    static positionWidth = 65

    static columns = 17
    static boardWidth: number = Tile.positionWidth * Tile.columns


    static rows = 33
    static boardHeight: number = Tile.positionWidth * Tile.rows


    static space = 1



    public createSection(color: number, ratio: number, side: number = Tile.positionWidth): THREE.Mesh {

        return new THREE.Mesh(
            new THREE.BoxGeometry( Tile.positionWidth * this.zoom, Tile.positionWidth * this.zoom, ratio * this.zoom ),
            new THREE.MeshPhongMaterial( { color } )
        )
    }


    public render(colors: Array<number> = Color.grass, ratio = 5): THREE.Mesh {

        const color: number = this.getRandomColor(colors)
        const section: THREE.Mesh = this.createSection(color, ratio)


        return section
    }
}



export default Tile
