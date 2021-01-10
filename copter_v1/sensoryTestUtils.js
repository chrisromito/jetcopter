const util = require('util')
const timeout = util.promisify(setTimeout)
const { Board, Pin } = require('johnny-five')

const { INPUT, OUTPUT } = Pin
const NS_PER_MICROSECOND = 1000
const MICROSECOND_PER_MS = 1000
const MS_PER_SECOND = 1000

const microToMs = micro => micro / MICROSECOND_PER_MS


//-- Board setup
const Blackboard = new Board({
    repl: false,
    debug: true
})

// Blackboard.on('ready', ()=> {
//     const component = new Proximity({
//         board: Blackboard,
//         pin: 0,
//         controller: PROXIMITY_CONTROLLER
//     })
//
//     Blackboard.repl.inject({
//         proximity: component
//     })
//
//     component.on('change', ()=> {
//         const { cm, inches } = component
//         console.log(`ultrasonic:
//             { cm: ${cm}, inches: ${inches} }
//         `
//     })
// })


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

const queryPin = pin => new Promise((resolve, reject)=> {
    pin.query((error, value)=> {
        if (error) {
            return reject(error)
        }
        return resolve(value)
    })
})


/**
 * @func triggerPin - Creates the trigger (output) pin used
 * to create a proximity sensor
 * @param n - Pin Number
 * @returns {Object}
 */
const triggerPin = n => {
    const trigger = new Pin({
        board: Blackboard,
        pin: n,
        // mode: OUTPUT
        mode: PIN_MODES.SERIAL
    })

    return {
        name: 'trigger',
        pin: n,
        value: ()=> trigger,
        /**
         * @method next - The sensor is triggered by a HIGH pulse that lasts >= 10 microseconds
         * So we set it low for 5 mis, high for ~15 mis, then low again
         * @returns {Promise<Pin>}
         */
        next: async()=> {
            trigger.low()
            // Chill for 5 microseconds
            await timeout(microToMs(5))
            trigger.high()
            // The sensor is triggered by a HIGH pulse that lasts >= 10 microseconds
            await timeout(microToMs(15))
            trigger.low()
            return Promise.resolve(trigger)
        },

        query: ()=> queryPin(trigger)
    }

}

const echoPin = n => {
    const echo = new Pin({
        board: Blackboard,
        pin: n,
        // mode: INPUT
        mode: PIN_MODES.SERIAL
    })
    let lastValue = null

    echo.on('data', data => {
        if (data && lastValue !== data) {
            lastValue = data
            console.log(`echo.onData -> ${data}`)
        }
    })
    return {
        name: 'echo',
        pin: n,
        lastValue: ()=> lastValue,
        value: ()=> echo,
        next: async(trigger)=> {
            await trigger.next()
            return lastValue
        },
        query: ()=> queryPin(echo)
    }
}


const PingProxy = (trigPinNum, echoPinNum)=> {
    const trigger = triggerPin(trigPinNum)
    const echo = echoPin(echoPinNum)

    return {
        echo,
        trigger,
        next: async ()=> {
            const value = await echo.next(trigger)
            console.log(value)
            return value
        }
    }
}

let _mainValue = null

const TRIGGER_PIN = 1
const ECHO_PIN = 0

const onRead = pinNum => value => console.log(`pin ${pinNum} value: ${value}`)

Blackboard.on('ready', ()=> {
    const board = Blackboard
    board.pinMode(ECHO_PIN, PIN_MODES.INPUT)
    board.digitalRead(ECHO_PIN, onRead(ECHO_PIN))

    board.pinMode(TRIGGER_PIN, PIN_MODES.OUTPUT)
    // board.digitalRead(TRIGGER_PIN, onRead(TRIGGER_PIN))

    console.log('ready')
})

const writeToTrigger = ()=>
    Blackboard.digitalWrite(TRIGGER_PIN, 0x55)



const getMain = ()=> _mainValue

module.exports = { Blackboard, getMain, TRIGGER_PIN, ECHO_PIN, writeToTrigger }

