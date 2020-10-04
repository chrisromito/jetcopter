import { Board, IMU, Altimeter, GPS } from 'johnny-five'
import { IS_DEV, IS_PI, LOOP_DURATION } from './constants'

let io = undefined
if (IS_PI) {
    const { RaspiIO } = require('raspi-io')
    io = new RaspiIO()
}

const IMU_CONTROLLER = 'MPU6050'

export const Pi = new Board({
    io,
    debug: IS_PI || IS_DEV,
    repl: IS_PI || IS_DEV
})

Pi.on("ready", function() {
    const main = this
    return initController()
        .then(({ board, imu })=> {
            main.repl.inject({
                board,
                imu
            })
            return { main, board, imu }
        })
})



export const initController = ()=> {
    const Blackboard = new Board({
        debug: IS_DEV,
        repl: IS_DEV
    })
    return new Promise((resolve, reject)=> {
        try {
            Blackboard.on('ready', function() {
                const board = this
                const imu = new IMU({
                    board,
                    controller: IMU_CONTROLLER
                })

                imu.once('change', ()=> {
                    console.log('\n\nAccelerometer \n=========')
                    logProps(imu.accelerometer, [
                        'x',
                        'y',
                        'z',
                        'pitch',
                        'roll',
                        'acceleration',
                        'inclination',
                        'orientation'
                    ])

                    console.log('\n\nGyro \n=============')
                    logProps(imu.gyro, [
                        'x',
                        'y',
                        'z',
                        'pitch',
                        'roll',
                        'yaw',
                        'rate',
                        'isCalibrated'
                    ])
                })

                const gps = new GPS({
                    board,
                    
                })
                return resolve({
                    board,
                    imu,
                })
            })
        } catch(error) {
            return reject(error)
        }
    })
}


const logProps = (obj, props=null)=> {
    try {

        const filteredPairs = !props ? Object.entries(obj) : Object.entries(obj).filter(([k, v]) => props.includes(k))
        const objToLog = filteredPairs.reduce((accum, [k, v])=> ({ ...accum, [k]: v }), {})
        console.log(JSON.stringify(objToLog, null, 4))
    } catch(err) {
        console.log(obj)
    }
}
