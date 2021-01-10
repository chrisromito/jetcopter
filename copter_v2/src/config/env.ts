// @ts-ignore
import * as dotenv from 'dotenv'
import { join } from 'path'
import { argv } from 'yargs'


export const ROOT_DIR = join(
    __dirname,
    '..',
    '..',
    '..'
)

dotenv.config({
    path: join(ROOT_DIR, '.env')
})

export const {
    NODE_ENV = 'development',
    IS_PI=true,
    SECRET_KEY = 'my_secret_copter',
    SITE_DOMAIN = 'http://0.0.0.0:8080',
    SOCKET_DOMAIN = 'wss://0.0.0.0:8080',
    REDIS_HOST,
    REDIS_PORT = 6379,
    REDIS_DB,
    REDIS_USER,
    REDIS_PASSWORD,
    PORT= 8080,
    SOCKET_PORT=8080
} = process.env


export const IS_DEV = NODE_ENV !== 'production'

export const IS_TEST = argv.test === "true"
