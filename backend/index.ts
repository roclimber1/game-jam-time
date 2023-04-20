
import express, { Express, Request, Response } from 'express'

import { Server } from 'socket.io'
import http from 'http'

import dotenv from 'dotenv'

import { join as joinPath } from 'path'


import WebSocketServer from './web_socket_server'



dotenv.config()


const app: Express = express()
const port = process.env.PORT || 8080


const server: http.Server = http.createServer(app)
const io: Server = new Server(server)


app.get('/', (request: Request, response: Response) => {

    response.sendFile(joinPath(__dirname, '../../dist/index.html'))
})


app.use(express.static('dist'))



new WebSocketServer(io)



server.listen(port, () => {

    console.debug(`listening on *:${port}`)

    console.debug(`⚡️[server]: Server is running at http://localhost:${port}`)
})
