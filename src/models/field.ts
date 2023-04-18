
import * as THREE from 'three'


import Color from './color'
import Item from './item'
import Tile from './tile'



class Field extends Item {


    private tile: Tile = new Tile(this.zoom)

    static groundUuid: string


    public findClosestTile() {

        //
    }


    private renderLine(colors: Array<number> = Color.grass, ratio = 5): THREE.Group {

        const grass: THREE.Group = new THREE.Group()


        let color: number

        Tile.positions.forEach((index) => {

            color = this.getRandomColor(colors)
            const section: THREE.Mesh = this.tile.createSection(color, ratio)

            section.position.x = index * (Tile.positionWidth * this.zoom + Tile.space * this.zoom)
            section.receiveShadow = true

            grass.add(section)
        })


        return grass
    }


    public renderGroundLayer(): THREE.Mesh {

        const color: number = this.getRandomColor(Color.tiles)
        const side: number = (Tile.positionWidth * this.zoom * Tile.positions.length + Tile.space * this.zoom * Tile.positions.length) * 2

        const ground: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry( side, side, 3 * this.zoom ),
            new THREE.MeshPhongMaterial( { color } )
        )

        ground.position.y = 0
        ground.position.x = 0

        ground.receiveShadow = true

        Field.groundUuid = ground.uuid

        return ground
    }


    public render(): THREE.Group {

        const field: THREE.Group = new THREE.Group()


        const ground: THREE.Mesh = this.renderGroundLayer()

        field.add( ground )


        Tile.positions.forEach((index) => {

            const sign: number = this.getRandomSign()


            const isGrass = (sign > 0)
            const colors = isGrass ? undefined : Color.tiles

            const tile = this.renderLine(colors)


            tile.position.y = index * (Tile.positionWidth * this.zoom + Tile.space * this.zoom)

            field.add( tile )

        })


        return field
    }
}



export default Field
