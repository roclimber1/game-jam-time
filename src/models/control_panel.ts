

import { SETTINGS } from '../../common/constants'
import { ICON } from '../constants'



import type Connector from '@/src/models/connector'
import type { AddInfoBlockParameters } from '../interfaces'




type Controls = {
    bottomPanel: HTMLElement | null,
    chatButton: HTMLButtonElement | null,
    chatInput: HTMLInputElement | null,
    counter: HTMLElement | null,
    leftPanel: HTMLElement | null,
    progressBarPanel: HTMLElement | null,
    rightPanel: HTMLElement | null,
    topPanel: HTMLElement | null
}


enum PANEL {
    BOTTOM = 'bottom-panel',
    LEFT = 'left-panel',
    PROGRESS_BAR_PANEL = 'progress-bar-panel',
    RIGHT = 'right-panel',
    TOP ='top-panel'
}


enum ELEMENT {
    SCORE = 'score',
    CHAT_BUTTON = 'chat-button',
    CHAT_INPUT = 'chat-input'
}


const ICONS: Array<ICON> = [
    ICON.MOVE,
    ICON.STONE,
    ICON.STONE_GATHERING,
    ICON.TRAP,
    ICON.WOOD,
    ICON.WOOD_GATHERING
]


const DEFAULT_TICK = 100

const CIRCULAR_BAR_RADIUS = 30
const FULL_CIRCLE_LENGTH = 2 * Math.PI * CIRCULAR_BAR_RADIUS


class ControlPanel {

    private connector: Connector


    private controls: Controls = {
        bottomPanel: null,
        chatButton: null,
        chatInput: null,
        counter: null,
        leftPanel: null,
        progressBarPanel: null,
        rightPanel: null,
        topPanel: null
    }


    constructor(connector: Connector) {

        this.connector = connector

        this.init()
    }


    private handleClickChatButton(): void {

        const message: string = this.controls.chatInput?.value as string

        if (message) {

            this.connector.sendMessage(message)

            if (this.controls.chatInput) {

                this.controls.chatInput.value = ''
            }
        }
    }


    private init() {

        this.controls.counter = document.getElementById(ELEMENT.SCORE)

        this.controls.chatButton = document.getElementById(ELEMENT.CHAT_BUTTON) as HTMLButtonElement
        this.controls.chatInput = document.getElementById(ELEMENT.CHAT_INPUT) as HTMLInputElement


        this.drawPanels()


        const handleClickChatButton = () => this.handleClickChatButton()


        this.controls.chatButton.addEventListener('click', handleClickChatButton)
    }


    private drawPanels() {

        this.controls.topPanel = document.getElementById(PANEL.TOP)
        this.controls.bottomPanel = document.getElementById(PANEL.BOTTOM)
        this.controls.leftPanel = document.getElementById(PANEL.LEFT)
        this.controls.rightPanel = document.getElementById(PANEL.RIGHT)

        this.controls.progressBarPanel = document.getElementById(PANEL.PROGRESS_BAR_PANEL)


        this.initIcons()
    }


    private initIcons() {

        ICONS.forEach((icon: ICON) => {

            const element: HTMLElement = document.getElementById(icon) as HTMLElement
            const tokens: Array<string> = 'w-20 h-20 rounded-lg bg-slate-700 m-2 flex flex-row justify-center text-4xl items-center'.split(' ')

            element.classList.add(...tokens)
        })
    }


    private getProgressBarElement(selector = '.progress-content', baseClass = 'progress-bar'): HTMLElement {

        const element: HTMLElement = document.getElementById(baseClass)?.querySelector(selector) as HTMLElement

        return element
    }


    private updateProgressBar(opponent: boolean) {

        const element: HTMLElement = this.getProgressBarElement()
        const textBlock: HTMLElement = document.getElementById('progress-bar-text') as HTMLElement


        if (opponent) {

            element?.classList.add('progress-bar-opponent')

            if (textBlock) {

                textBlock.innerHTML = 'Now your opponent\'s turn'
            }

        } else {

            element?.classList.remove('progress-bar-opponent')

            if (textBlock) {

                textBlock.innerHTML = 'Now your turn'
            }
        }
    }


    private time = SETTINGS.TURN_TIME * 1000
    private tick = 0
    private sigh = -1

    private intervalHandler: NodeJS.Timer | null = null


    private progressBarTick() {

        this.tick += this.sigh * DEFAULT_TICK

        const element: HTMLElement = this.getProgressBarElement('.progress-content > line')


        element.style.strokeDashoffset = `${Math.round((this.tick / this.time) * 100)}%`

        if (this.tick >= this.time) {

            this.intervalHandler && clearInterval(this.intervalHandler)
        }
    }


    public startTimer(opponent = false) {

        this.sigh = this.sigh * -1


        this.updateProgressBar(opponent)


        console.debug('🚀 ~ file: control_panel.ts:165 ~ ControlPanel ~ startTimer ~ opponent:', opponent)


        this.intervalHandler && clearInterval(this.intervalHandler)

        this.intervalHandler = setInterval(() => this.progressBarTick(), DEFAULT_TICK)
    }


    public stopTimer() {

        this.tick = 0

        this.intervalHandler && clearInterval(this.intervalHandler)
    }


    private updateCircularBar(initValue: number, totalValue: number, className: string) {

        let value: number = initValue


        const element: HTMLElement = this.getProgressBarElement('.progress-content > circle', className)


        if (value < 0) {
            value = 0
        }

        const currentDashoffset: number = ((100 - (value * 100 / totalValue)) / 100) * FULL_CIRCLE_LENGTH


        element.style.strokeDashoffset = `${currentDashoffset}px`
        element.style.strokeDasharray = `${FULL_CIRCLE_LENGTH}px`
    }


    public updateMovesCounter(movesCounter: number) {

        const value = SETTINGS.TOTAL_MOVES - movesCounter

        this.updateCircularBar(value, SETTINGS.TOTAL_MOVES, 'progress-bar-circular')
    }


    public updateEnergyCounter(energy: number) {

        this.updateCircularBar(energy, SETTINGS.ENERGY, 'progress-bar-energy')
    }




    public hideProgressBarPanel() {

        if (this.controls.progressBarPanel) {

            this.controls.progressBarPanel.style.display = 'none'
        }
    }


    public showProgressBarPanel() {

        if (this.controls.progressBarPanel) {

            this.controls.progressBarPanel.style.display = 'flex'
        }
    }


    public gameOver() {

        this.hideProgressBarPanel()
        this.stopTimer()
    }




    public changeWaitingRoom(status: boolean): HTMLElement {

        const waitingRoomBlock: HTMLElement = document.getElementById('waiting-room') as HTMLElement

        if (status) {

            waitingRoomBlock?.classList.remove('invisible')
        } else {

            waitingRoomBlock?.classList.add('invisible')
        }


        return waitingRoomBlock
    }


    public updateIcon(icon: ICON, grayscale: boolean, value: number) {

        const element: HTMLElement = document.getElementById(icon) as HTMLElement
        const counter: HTMLElement | null = element.querySelector('.icon-text')


        element.style.filter = grayscale ? 'grayscale(1)' : 'grayscale(0)'

        if (counter) {

            counter.innerHTML = String(value)
        }
    }


    private addInfoBlock(parameters: AddInfoBlockParameters): HTMLDivElement {

        const { icon = '', text, className = 'bonus-animation', autoRemove = true, autoRemoveTimeout = 2000 } = parameters

        const item: HTMLDivElement = document.createElement('div')

        item.className = className
        item.innerHTML = icon ? `${icon} ${text}` : text

        autoRemove && setTimeout(() => item.remove(), autoRemoveTimeout)

        return item
    }


    public addHoveringInfoBlock(event: MouseEvent) {

        return (parameters: AddInfoBlockParameters) => {

            const { clientX, clientY } = event

            const item: HTMLDivElement = this.addInfoBlock(parameters)

            item.className = `${item.className} h-fit w-fit p-2 absolute flex justify-center rounded-lg bg-slate-800 opacity-80 text-3xl`

            const size = 120

            item.style.left = Math.round(clientX - size / 2) + 'px'
            item.style.top = Math.round(clientY - size / 2) + 'px'

            document.body.appendChild(item)
        }
    }


    public updateBottomPanel(parameters: AddInfoBlockParameters) {

        if (this.controls.bottomPanel) {

            const item: HTMLDivElement = this.addInfoBlock(parameters)

            item.className = `${item.className} h-full w-full p-2 mr-3 flex flex-row justify-center items-center text-lg`

            this.controls.bottomPanel.innerHTML = ''
            this.controls.bottomPanel.appendChild(item)
        }
    }


    public clearBottomPanel() {

        if (this.controls.bottomPanel) {

            this.controls.bottomPanel.innerHTML = ''
        }
    }

}






export default ControlPanel
