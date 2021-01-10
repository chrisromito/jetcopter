import { Board, IMU, Altimeter, GPS } from 'johnny-five'
import { IS_DEV, IS_PI, LOOP_DURATION } from './constants'

//-- Constants
const IMU_CONTROLLER = 'MPU6050'
const ALTIMETER_CONTROLLER = 'BMP280'
//
// //-- Setup
// const { RaspiIO } = require('raspi-io')
// const io = new RaspiIO()
//
// export const Pi = new Board({
//     io,
//     debug: true,
//     repl: true
// })
//
// Pi.on("ready", function() {
//     const main = this
//     return initController()
//         .then(value => {
//             main.repl.inject(value)
//             return { main, ...value}
//         })
//         .catch(error => {
//             console.error(`FUCKING BLACKBOARD!`)
//             console.error(error)
//             return Promise.resolve(error)
//         })
// })


// Sensory Board (Blackboard) initialization
export const initController = ()=> {
    const Blackboard = new Board({
        debug: true,
        repl: false
    })
    return new Promise((resolve, reject)=> {
        try {
            Blackboard.on('ready', function() {
                const board = this
                // const imu = new IMU({
                //     board,
                //     controller: IMU_CONTROLLER
                // })
                //
                // imu.once('change', ()=> {
                //     console.log('\n\nAccelerometer \n=========')
                //     logProps(imu.accelerometer, [
                //         'x',
                //         'y',
                //         'z',
                //         'pitch',
                //         'roll',
                //         'acceleration',
                //         'inclination',
                //         'orientation'
                //     ])
                //
                //     console.log('\n\nGyro \n=============')
                //     logProps(imu.gyro, [
                //         'x',
                //         'y',
                //         'z',
                //         'pitch',
                //         'roll',
                //         'yaw',
                //         'rate',
                //         'isCalibrated'
                //     ])
                // })
                //
                // //-- Altimeter/Barometer
                // const altimeter = new Altimeter({
                //     board,
                //     controller: ALTIMETER_CONTROLLER
                // })
                //
                // altimeter.once('change', function() {
                //     console.log('Altimeter:')
                //     logProps(this, [
                //         'feet',
                //         'meters'
                //     ])
                // })
                // Blackboard pins 0 & 1 === rx, tx (respectively)
                // GPS is powered via QWIIC. RX & TX are pinned directly to the board
                // NOTE: I think the above MIGHT be me working around a bug, but I'm not 100% sure
                // I understand any of this well enough to say it's not MY code.  So I'm trying to
                // pin the GPS board directly because I'm looking at it as analogous to a config
                // issue - I think I'm just not using the GPS board correctly?
                // const gps = new GPS({ board, pins: { rx: 0, tx: 1 } })
                // // GPS Lat, long & alt
                // gps.on('change', function() {
                //     console.log('GPS.onChange()')
                //     logProps(this, [
                //         'latitude',
                //         'longitude',
                //         'altitude'
                //     ])
                // })
                //
                // // GPS navigation/course/path
                // gps.on('navigation', function() {
                //     console.log('GPS.onNavigation()')
                //     logProps(this, [
                //         'speed',
                //         'course'
                //     ])
                // })

                // return resolve({
                //     board,
                //     gps
                //     // imu,
                // })
                return resolve({ board })
            })
        } catch(error) {
            return reject(error)
        }
    })
}


const GpsEvents = {
    onChange() {
        console.log('GPS.onChange()')
        logProps(this, [
            'latitude',
            'longitude',
            'altitude'
        ])
    },
    onNavigation() {
        console.log('GPS.onNavigation()')
        logProps(this, [
            'speed',
            'course'
        ])
    }
}


const logProps = (obj, props=null)=> {
    try {
        const keys = props ? props : Object.keys(obj)
        const objToLog = keys.reduce((accum, k)=> {
            accum[k] = obj[k]
            return accum
        }, {})
        console.log(JSON.stringify(objToLog, null, 4))
    } catch(err) {
        console.log(obj)
    }
}
