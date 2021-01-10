// @ts-ignore
import { BehaviorSubject, fromEvent } from 'rxjs'
import { Board } from 'johnny-five'
import { ComponentStatus } from './states/component'
import { IS_DEV, IS_TEST } from './config/env'
import { Peripheral, PeripheralSystem } from './components/peripheral'
import { Sensory, SensorySystem } from './components/sensors'
import { Redis } from './lib/redis'


const getIo = ()=> {
    // Test mode uses mock firmata to leverage spies/stubs
    if (IS_TEST) {
        const { Firmata } = require('mock-firmata')
        // TODO: Review what's up with the 'pins' option
        return new Firmata({ pins: [] })
    }
    // Assume we're running on the Pi
    // If  dependencies aren't installed this will fail (intentionally)
    const raspi = require('raspi-io').RaspiIO
    return new raspi()
}


export const Pi = () =>
    new Board({
        debug: IS_DEV,
        repl: false,
        io: getIo()
    })


export const setup = (board: Board): Promise<NervousSystem> =>
    new Promise(resolve =>
        board.isReady || IS_TEST
            ? resolve(true)
            : board.on('ready', () => resolve(true))
    ).then(async ()=> {
        const peripheral = await setupPeripheral(board)
        const sensory = await setupSensory(board)
        return {
            peripheral,
            sensory
        }
    })

interface NervousSystem {
    peripheral: Peripheral,
    sensory: Sensory
}

export const setupPeripheral = (board: Board): Peripheral=> PeripheralSystem(board)


export const setupSensory = (board: Board): Sensory => SensorySystem(board)



//-- TODO: move this somewhere else
const sensoryObserver = name => ({
    next: value => Redis.set(name, value),
    error: e =>
        Redis.get(name)
            .then(value =>
                // Ensure the error state is reflected in Redis
                sensoryObserver(name).next({
                    ...value,
                    status: ComponentStatus.error,
                    error: e.message
                })
            )
})
