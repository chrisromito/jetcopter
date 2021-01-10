import { promisify } from 'util'
import redis from 'redis'
import { REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_USER, REDIS_PASSWORD } from '../config/env'

export const redisConfig = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    db: REDIS_DB || undefined,
    user: REDIS_USER || undefined,
    password: REDIS_PASSWORD || undefined
}


const client = redis.createClient(redisConfig)

const redisGet = promisify(client.get).bind(client)
const redisSet = promisify(client.set).bind(client)


export const Redis = {
    client,
    get: redisGet,
    set: redisSet
}
