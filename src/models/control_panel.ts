

import type Connector from '@/src/models/connector'



type Controls = {
    counter: HTMLElement | null,
    chatButton: HTMLButtonElement | null,
    chatInput: HTMLInputElement | null,
    topPanel: HTMLElement | null,
    bottomPanel: HTMLElement | null,
    rightPanel: HTMLElement | null,
    leftPanel: HTMLElement | null
}


enum PANEL {
    TOP ='top-panel',
    BOTTOM = 'bottom-panel',
    LEFT = 'left-panel',
    RIGHT = 'right-panel'
}

enum ELEMENT {
    SCORE = 'score',
    CHAT_BUTTON = 'chat-button',
    CHAT_INPUT = 'chat-input'
}



class ControlPanel {

    private connector: Connector


    private controls: Controls = {
        counter: null,
        chatButton: null,
        chatInput: null,
        topPanel: null,
        bottomPanel: null,
        rightPanel: null,
        leftPanel: null
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
    }
}




export default ControlPanel
