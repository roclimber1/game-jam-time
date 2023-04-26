
import * as THREE from 'three'


import Color from '../../common/models/color'
import Item from './item'
import Tile from './tile'

import { ITEM } from '../../common/constants'



import type { GridCell } from '../../common/interfaces'




type GetDistanceBetweenTiles = {
    distance: number,
    nearest: boolean
}



class Field extends Item {

    public static grid: Array<GridCell> = []

    public tile: Tile = new Tile(this.zoom)

    public positions: Array<number> = Tile.positions
    public positionWidth: number = Tile.positionWidth

    public space: number = Tile.space
    public static lastIndex: number = Tile.lastIndex

    static groundUuid: string
    static ratio = 5


    static zoom: number


    constructor(public zoom: number) {

        super(zoom)

        Field.zoom = zoom
    }


    static checkNearestTile(cells: Array<GridCell>): GetDistanceBetweenTiles {

        const xDiff: number = cells[0]?.centreX - cells[1].centreX
        const yDiff: number = cells[0]?.centreY - cells[1].centreY

        const distance: number = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))

        const maxDistance: number = Math.sqrt(2 * Math.pow(Tile.positionWidth * Field.zoom, 2)) + 3

        const nearest: boolean = (distance <= maxDistance)


        return {
            distance,
            nearest
        }
    }



    static getDistanceBetweenTiles(cells: Array<GridCell>): GetDistanceBetweenTiles {

        const xDiff: number = cells[0]?.indexX - cells[1]?.indexX
        const yDiff: number = cells[0]?.indexY - cells[1]?.indexY


        const distance: number = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))

        const maxDistance: number = Math.sqrt(2) + 0.1

        const nearest: boolean = (distance <= maxDistance)

        return {
            distance,
            nearest
        }
    }


    static updateGrid(grid: Array<GridCell>) {

        Field.grid = grid.map((cell, index) => {

            return {
                ...Field.grid[index],
                item: cell.item,
                occupied: cell.occupied,
                type: cell.type
            }
        })
    }


    static removeItemFromTile(cell: GridCell) {

        const tile: GridCell = Field.getTileByUuid(cell.id)

        tile.occupied = false
        tile.item = undefined
        tile.type = ITEM.EMPTY
        tile.parameters = {}
    }


    static getTileByUuid(uuid: string): GridCell {

        const tile: GridCell = Field.grid.find((cell) => {

            return (cell.id === uuid)
        }) as GridCell

        return tile
    }


    static getTileByItemUuid(uuid: number): GridCell {

        const tile: GridCell = Field.grid.find((cell) => (cell?.item as THREE.Object3D)?.id === uuid) as GridCell

        return tile
    }


    static getTileByCentrePosition(item: THREE.Object3D): GridCell {

        const position: THREE.Vector2 = new THREE.Vector2(item.position.x, item.position.y)

        const tile: GridCell = Field.grid.find((cell) => {

            const cellCentrePosition = new THREE.Vector2(cell.centreX, cell.centreY)

            return cellCentrePosition.equals(position)

        }) as GridCell


        return tile
    }


    static getTileByPosition(position: THREE.Vector3): GridCell {

        const tile: GridCell = Field.grid.find((cell) => cell.position.equals(position)) as GridCell

        return tile
    }


    static getTileByIndexData(position: GridCell): GridCell {

        const tile: GridCell = Field.grid.find((cell) => {

            return (cell.indexX == position.indexX)
                && (cell.indexY == position.indexY)

        }) as GridCell

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
                parameters: {},
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
