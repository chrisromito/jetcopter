import * as R from 'ramda'
import redis from 'redis'
import { IS_DEV, REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_USER, REDIS_PASSWORD } from './constants'
import { toJson, toJs } from './shared/type'

const redisConfig = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    db: REDIS_DB,
    user: REDIS_USER,
    password: REDIS_PASSWORD
}


export const Client = redis.createClient(redisConfig)
export const RedisClient = client

// Store interface (get & set values)
export const Store = {
    get: key => new Promise((resolve, reject)=>
        Client.get(key, (err, value)=>
            err ? reject(err) : resolve(value)
        )
    ),

    set: (key, value)=> new Promise((resolve, reject)=>
        Client.set(key, value,
            err => err ? reject(err) : resolve(value)
        )
    ),

    setPartial: key => value => Store.set(key, value)
}


//-- Pub/Sub
export const Publisher = Store
export const Subscriber = redis.createClient(redisConfig)


// Add the initial eventListener (sets the store in 'subscriber mode')
Subscriber.on('message', (channel, message)=> {
    if (IS_DEV) {
        console.log(`copter.events -> Subscriber.on('message')
            channel: ${channel} (Aka event Name)
            message: ${message} (Aka event value)
        `)
    }
})


export const publish = name => message =>
    new Promise(resolve => {
        const value = toJson(message)
        Publisher.publish(name, value, ()=> resolve(value))
    })


export const subscribe = name => fn => {
    const onMessage = (channel, message)=>
        channel === name
            ? fn( toJs(message) )
            : null
    Subscriber.off('message', onMessage)
    Subscriber.on('message', onMessage)
    return ()=> Subscriber.off('message', onMessage)
}


