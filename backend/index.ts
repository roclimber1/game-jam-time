
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import { join as joinPath } from 'path'


dotenv.config()


const app: Express = express()
const port = process.env.PORT || 8080


app.get('/', (request: Request, response: Response) => {

    response.sendFile(joinPath(__dirname, '../index.html'))
})


app.use(express.static('dist'))



app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
