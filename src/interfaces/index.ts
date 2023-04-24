
import { MESSAGE } from '@/common/constants'



export interface AbstractConnector {
    checkConnection: () => boolean,
    sendData?: <Data = any>(data: Data, type: MESSAGE) => void
}


export interface Listener<Data = any> {
    type: MESSAGE,
    callback: (data: Data) => void
}



export type RenderGameOverScreenParameters = {
    body: string,
    buttonText: string,
    element: HTMLElement,
    icon: string,
    startNewGame: () => void,
    text: string,
    title: string
}
