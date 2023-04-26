
import GameRoom from './models/GameRoom'

import { MESSAGE } from '../common/constants'



import type { Server, Socket } from 'socket.io'
import type { ActionParameters, ChatMessage, DataWIthRoomNumber, GameRoomBase, GridCell, GridCellData } from '../common/interfaces'




class WebSocketServer {

    public socket!: Socket


    private roomNumber = 1

    public rooms: Map<string, GameRoom> = new Map<string, GameRoom>()



    constructor(private io: Server) {

        this.init()
    }


    private init() {

        this.io.on('connection', (socket) => {

            console.debug('socket > a user connected', socket.id)



            this.socket = socket

            this.initRooms()
            this.setMessageHandler()



            socket.on('disconnect', () => {

                console.log('user disconnected')
            })
        })
    }


    private initRooms() {


        const roomId = GameRoom.getRoomId(this.roomNumber)


        this.socket && this.socket.join(roomId)


        const rooms = this.io.of('/').adapter.rooms

        const roomsVisitorsAmount = rooms.get(roomId)?.size


        if (!this.rooms.get(roomId)) {

            this.rooms.set(roomId, new GameRoom(this.roomNumber, rooms))
        }



        this.io.of('/').adapter.on('leave-room', (roomId, id) => {

            const room = this.rooms.get(roomId)

            room?.removePlayer(id)


            const roomData: GameRoomBase | null = room ? room?.getRoomData() : null


            this.io.to(roomId).emit(MESSAGE.LEFT_ROOM, roomData)


            rooms.delete(roomId)
        })



        if (roomsVisitorsAmount == 1) {

            const room = this.rooms.get(roomId)

            room?.setFirstPlayer()

            this.sendRoomsData()
        }


        if (roomsVisitorsAmount && (roomsVisitorsAmount > 1)) {

            this.sendRoomsData()

            this.roomNumber += 1
        }
    }


    private sendRoomsData() {

        const roomId = GameRoom.getRoomId(this.roomNumber)
        const room = this.rooms.get(roomId)

        const rooms = this.io.of('/').adapter.rooms

        room?.updatePlayers(rooms)

        const roomData: GameRoomBase | null = room ? room?.getRoomData() : null


        roomData && this.io.to(roomId).emit(MESSAGE.SET_ROOMS_DATA, roomData)
    }



    private setMessageHandler() {


        this.socket.on(MESSAGE.INIT_MAP, (data: DataWIthRoomNumber<GridCellData>): void => {

            const { grid, roomNumber } = data


            const roomId: string = GameRoom.getRoomId(roomNumber)
            const room = this.rooms.get(roomId)


            const newGrid: Array<GridCell> = room?.getMap(grid) || []


            this.io.to(roomId).emit(MESSAGE.MAP, newGrid)
        })


        this.socket.on(MESSAGE.MAP_INITIALIZED, (data: DataWIthRoomNumber): void => {

            const { roomNumber } = data
            const roomId: string = GameRoom.getRoomId(roomNumber)
            const room = this.rooms.get(roomId)

            const roomData: GameRoomBase | null = room ? room?.getRoomData() : null


            room && room.startTimer(() => {

                this.io.to(roomId).emit(MESSAGE.TURN, room?.getRoomData())
            })


            this.io.to(roomId).emit(MESSAGE.TURN, roomData)
        })


        this.socket.on(MESSAGE.ACTION, (data: DataWIthRoomNumber<ActionParameters>): void => {

            const { roomNumber } = data
            const roomId: string = GameRoom.getRoomId(roomNumber)
            const room = this.rooms.get(roomId)


            const performed: boolean = room?.performAction(data) as boolean
            const roomData: GameRoomBase | null = room ? room?.getRoomData() : null


            if (performed) {

                this.io.to(roomId).emit(MESSAGE.ACTION, {
                    actionData: data,
                    roomData
                })
            }
        })


        this.socket.on(MESSAGE.CHAT_MESSAGE, (data: DataWIthRoomNumber<ChatMessage>): void => {

            const { message, roomNumber } = data
            const roomId: string = GameRoom.getRoomId(roomNumber)


            this.io.to(roomId).emit(MESSAGE.CHAT_MESSAGE, message)

        })

    }
}



export default WebSocketServer
