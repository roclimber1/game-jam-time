

type Point = {
    x: number,
    y: number
}


type Listeners = {
    mouseClickListener: (event: MouseEvent) => void,
    mouseMoveListener: (event: MouseEvent) => void
}


let listeners: Listeners = {
    mouseClickListener: (event: MouseEvent) => null,
    mouseMoveListener: (event: MouseEvent) => null
}


class SimpleMiniGame {

    private point!: Point


    constructor() {

        this.init()
    }


    private removeItem(item: HTMLDivElement) {

        item.remove()
    }


    private addItem(point: Point) {

        const item: HTMLDivElement = document.createElement('div')


        item.className = 'absolute flex justify-center'


        const size = 100

        item.style.width = size + 'px'
        item.style.height = size + 'px'

        item.style.left = Math.round(point.x - size / 2) + 'px'
        item.style.top = Math.round(point.y - size / 2) + 'px'



        item.innerHTML = `<svg
            version="1.1"
            id="L4"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enable-background="new 0 0 0 0"
            xml:space="preserve"
        >
            <circle
                fill="#475569"
                stroke="none"
                cx="16"
                cy="50"
                r="6"
            >
                <animate
                    attributeName="r"
                    attributeType="XML"
                    dur="1s"
                    values="1; 15; 1"
                    repeatCount="indefinite"
                    begin="0.1s"
                />

                <animate
                    attributeName="opacity"
                    dur="1s"
                    values="0; 1; 0"
                    repeatCount="indefinite"
                    begin="0.1s"
                />
            </circle>

        </svg>`


        document.body.appendChild(item)


        setTimeout(() => this.removeItem(item), 2000)
    }


    private interval: NodeJS.Timer | null = null



    private mouseMoveListener(event: MouseEvent) {

        const { clientX, clientY } = event

        this.point = {
            x: clientX,
            y: clientY
        }
    }

    private mouseClickListener(event: MouseEvent) {

        const { clientX, clientY } = event


        this.point = {
            x: clientX,
            y: clientY
        }


        if (this.interval) {

            clearInterval(this.interval)

            this.interval = null

        } else {

            this.interval = setInterval(() => this.addItem(this.point), 50)
        }
    }


    public init() {

        listeners = {
            mouseClickListener: this.mouseClickListener.bind(this),
            mouseMoveListener: this.mouseMoveListener.bind(this)
        }

        document.addEventListener('click', listeners.mouseClickListener)

        document.addEventListener('mousemove', listeners.mouseMoveListener)
    }


    public destroy() {

        if (this.interval) {

            clearInterval(this.interval)

            this.interval = null
        }

        document.removeEventListener('click', listeners?.mouseClickListener)

        document.removeEventListener('mousemove', listeners?.mouseMoveListener)
    }
}



export default SimpleMiniGame
