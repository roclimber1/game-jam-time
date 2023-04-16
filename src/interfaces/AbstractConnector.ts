


export interface AbstractConnector {
    checkConnection: () => boolean,
    sendMessage: (message: string) => void
}
