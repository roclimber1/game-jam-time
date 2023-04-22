
import * as THREE from 'three'


import Color from './color'
import Item from './item'
import Tile from './tile'

import { ITEM } from '../../common/constants'



import type { GridCell } from '../../common/interfaces'





class Field extends Item {

    public static grid: Array<GridCell> = []

    public tile: Tile = new Tile(this.zoom)

    public positions: Array<number> = Tile.positions
    public positionWidth: number = Tile.positionWidth

    public space: number = Tile.space
    public static lastIndex: number = Tile.lastIndex

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

        const tile: GridCell = Field.grid.find(cell => (cell.indexX == 0) && (cell.indexY == sign * Field.lastIndex)) as GridCell

        return tile
    }



    public renderLine(indexY: number, colors: Array<number> = Color.grass, positionY = 0, ratio = Field.ratio, grid = Field.grid): THREE.Group {

        const grass: THREE.Group = new THREE.Group()


        let color: number

        this.positions.forEach((index) => {

            color = this.getRandomColor(colors)
            const section: THREE.Mesh = this.tile.createSection(color, ratio)

            const positionX: number = index * (this.positionWidth * this.zoom + this.space * this.zoom)

            section.position.x = positionX
            section.receiveShadow = true


            grid.push({
                centreX:  positionX,
                centreY:  positionY,
                id: section.uuid,
                indexX: index,
                indexY,
                object: section,
                occupied: false,
                position: new THREE.Vector3(positionX, positionY, 0),
                type: ITEM.EMPTY
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


        this.positions.forEach((index) => {

            const sign: number = this.getRandomSign()

            const isLastLine: boolean = (Math.abs(index) == Field.lastIndex)

            const isGrass: boolean = (sign > 0)

            const grassColor: Array<number> | undefined = (isLastLine ? [Color.lastLine] : undefined)
            const colors: Array<number> | undefined = isGrass ? grassColor : Color.tiles


            const positionY: number = index * (this.positionWidth * this.zoom + this.space * this.zoom)

            const tile: THREE.Group = this.renderLine(index, colors, positionY)


            field.add( tile )

        })


        return field
    }



    public renderGroundLayer(): THREE.Mesh {

        const color: number = Color.ground
        const side: number = (this.positionWidth * this.zoom * this.positions.length + this.space * this.zoom * this.positions.length) * 2

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
