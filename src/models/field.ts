
import * as THREE from 'three'


import Color from './color'
import Item from './item'
import Tile from './tile'


export type GridCell = {
    centreX: number,
    centreY: number,
    id: string,
    indexX: number,
    indexY: number,
    object: THREE.Object3D,
    occupied: boolean,
    position: THREE.Vector3
}


class Field extends Item {

    static grid: Array<GridCell> = []

    private tile: Tile = new Tile(this.zoom)


    static groundUuid: string
    static ratio = 5


    public findClosestTile() {

        //
    }


    static getTileByUuid(uuid: string): GridCell {

        const tile: GridCell = Field.grid.find((cell) => cell.id === uuid) as GridCell

        return tile
    }


    static getTileByPosition(position: THREE.Vector3): GridCell {

        const tile: GridCell = Field.grid.find((cell) => cell.position.equals(position)) as GridCell

        return tile
    }


    static getStartTile(sign = 1): GridCell {

        const tile: GridCell = Field.grid.find(cell => (cell.indexX == 0) && (cell.indexY == sign * Tile.lastIndex)) as GridCell

        return tile
    }



    private renderLine(colors: Array<number> = Color.grass, positionY = 0, indexY: number, ratio = Field.ratio): THREE.Group {

        const grass: THREE.Group = new THREE.Group()


        let color: number

        Tile.positions.forEach((index) => {

            color = this.getRandomColor(colors)
            const section: THREE.Mesh = this.tile.createSection(color, ratio)

            const positionX = index * (Tile.positionWidth * this.zoom + Tile.space * this.zoom)

            section.position.x = positionX
            section.receiveShadow = true


            Field.grid.push({
                centreX:  positionX,
                centreY:  positionY,
                id: section.uuid,
                indexX: index,
                indexY,
                object: section,
                occupied: false,
                position: new THREE.Vector3(positionX, positionY, 0)
            })

            grass.add(section)
        })


        grass.position.y = positionY


        return grass
    }


    public render(): THREE.Group {

        const field: THREE.Group = new THREE.Group()


        const ground: THREE.Mesh = this.renderGroundLayer()

        field.add( ground )


        Tile.positions.forEach((index) => {

            const sign: number = this.getRandomSign()

            const isLastLine: boolean = (Math.abs(index) == Tile.lastIndex)

            const isGrass = (sign > 0)
            const colors = isGrass ? (isLastLine ? [Color.lastLine] : undefined) : Color.tiles


            const positionY = index * (Tile.positionWidth * this.zoom + Tile.space * this.zoom)

            const tile = this.renderLine(colors, positionY, index)


            field.add( tile )

        })


        return field
    }



    public renderGroundLayer(): THREE.Mesh {

        const color: number = Color.ground
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


}



export default Field
