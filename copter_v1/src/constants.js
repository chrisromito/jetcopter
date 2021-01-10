import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export const {
    NODE_ENV = 'development',
    IS_PI=true,
    SECRET_KEY = 'my_secret_copter',
    SITE_DOMAIN = 'http://0.0.0.0:8080',
    SOCKET_DOMAIN = 'wss://0.0.0.0:8080',
    REDIS_HOST = '127.0.0.1',
    REDIS_PORT = 6379,
    REDIS_DB = null,
    REDIS_USER = null,
    REDIS_PASSWORD = null,
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


//-- Global component state human-readable-key/values
export const STATE = {
    disconnected: 0,
    connected: 1,
    error: 2,
}

// Direct Board -> Pin connections
const PIN_MODES = {
    INPUT: 0,
    OUTPUT: 1,
    ANALOG: 2,
    PWM: 3,
    SERVO: 4,
    SHIFT: 5,
    I2C: 6,
    ONEWIRE: 7,
    STEPPER: 8,
    SERIAL: 10,
    PULLUP: 11,
    IGNORE: 127,
    PING_READ: 117,
    UNKNOWN: 16
}

const iTwoCModes = { WRITE: 0, READ: 1, CONTINUOUS_READ: 2, STOP_READING: 3 }


export const SensoryPins = {
    gps: { rx: 1, tx: 2 },
}


