

import type Connector from '@/src/models/connector'



type Controls = {
    counter: HTMLElement | null,
    chatButton: HTMLButtonElement | null,
    chatInput: HTMLInputElement | null
}



class ControlPanel {

    private connector: Connector


    private controls: Controls = {
        counter: null,
        chatButton: null,
        chatInput: null
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

        this.controls.counter = document.getElementById('score')

        this.controls.chatButton = document.getElementById('chat-button') as HTMLButtonElement
        this.controls.chatInput = document.getElementById('chat-input') as HTMLInputElement


        const handleClickChatButton = () => this.handleClickChatButton()


        this.controls.chatButton.addEventListener('click', handleClickChatButton)
    }
}




export default ControlPanel
