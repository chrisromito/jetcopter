import Primus from 'primus'
import { Server as Server_ } from './server'
import { SocketMiddleware } from './auth'

const primus = new Primus(Server_, {
    transformer: 'ws',
    parser: 'JSON',
    pathname: '/ws'
})
primus.authorize(SocketMiddleware)

export const Socket = primus
export default Socket


export const Server = Server_

export const mapConnections = mapFn => Socket.forEach((spark, id, connections)=> mapFn(spark, id, connections))

export const broadCast = obj => Socket.write(JSON.stringify(obj))


export const onConnect = fn => {
    Socket.off('connection', fn)
    Socket.on('connection', fn)
}


