
import * as THREE from 'three'


import Color from './color'
import Item from './item'
import Tile from './tile'



class Field extends Item {


    render(): THREE.Group {

        const field: THREE.Group = new THREE.Group()


        Tile.positions.forEach((index) => {


            const sign: number = this.getRandomSign()


            const isGrass = (sign > 0)

            const colors = isGrass ? undefined : Color.tiles
            const ratio = isGrass ? undefined : 2

            const tile = new Tile(this.zoom).render(colors, ratio)

            tile.position.y = index * (Tile.positionWidth * this.zoom + Tile.space * this.zoom)

            field.add( tile )

        })


        return field
    }
}



export default Field
