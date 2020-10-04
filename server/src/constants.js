import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export const {
    NODE_ENV = 'development',
    SECRET_KEY = 'my_secret_copter',
    SITE_DOMAIN = 'http://0.0.0.0:8080',
    SOCKET_DOMAIN = 'wss://0.0.0.0:8080',
    REDIS_HOST = '127.0.0.1',
    REDIS_PORT = 6379,
    REDIS_DB = '',
    REDIS_USER = '',
    REDIS_PASSWORD = '',
    PORT= 8080,
    SOCKET_PORT=8080
} = process.env

export const IS_DEV = NODE_ENV !== 'production'

export const ROOT_DIR = path.join(
    __dirname,
    '..'
)

const MS_PER_SECOND = 1000
const FRAMES_PER_SECOND = 60
export const LOOP_DURATION = MS_PER_SECOND / FRAMES_PER_SECOND
