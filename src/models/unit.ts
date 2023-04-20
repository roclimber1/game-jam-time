
import * as THREE from 'three'


import Color from './color'
import Item from './item'



type UnitRenderData = {
    color?: number,
    size?: number
}



class Unit extends Item {

    static size = 30

    static height = 50


    public render(data?: UnitRenderData): THREE.Group {

        const randomColor = this.getRandomColor(Color.units)
        const { color = randomColor, size = Unit.size } = data || {}

        const unit: THREE.Group = new THREE.Group()

        const body: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry( size * this.zoom, size * this.zoom, Unit.height * this.zoom ),
            new THREE.MeshPhongMaterial( { color, flatShading: true } )
        )

        body.position.z = (Unit.height / 2) * this.zoom
        body.castShadow = true
        body.receiveShadow = true

        unit.add(body)

        const rowel: THREE.Mesh = new THREE.Mesh(
            new THREE.BoxGeometry( 2 * this.zoom, 2 * this.zoom, 6 * this.zoom ),
            new THREE.MeshLambertMaterial( { color: 0x000000, flatShading: true } )
        )

        rowel.position.z = (Unit.height + 1) * this.zoom
        rowel.castShadow = true
        rowel.receiveShadow = false


        unit.add(rowel)



        const rowel2: THREE.Mesh = rowel.clone()

        rowel2.position.y += (size * this.zoom) / 4

        unit.add(rowel2)



        const rowel3: THREE.Mesh = rowel.clone()

        rowel3.position.y -= (size * this.zoom) / 4

        unit.add(rowel3)


        return unit
    }
}



export default Unit
