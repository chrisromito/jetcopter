import { Meta } from '../utils'
//-- Mind (Pi)
import { Led } from 'johnny-five'
//-- Sensory System (Blackboard)
import {
    GPS,
    Sensor as Sensor_,
    Accelerometer,
    Altimeter,
	Proximity,
	Light,
} from 'johnny-five'
//-- Arduino Mega
import { Servo, Motor } from 'johnny-five'


//-- Pi
/**
 * @class Led - LED status lights
 * @docs: http://johnny-five.io/api/led/
 */



//-- Blackboard Controller
/**
 * @class Altimeter
 * @docs http://johnny-five.io/api/altimeter/
 * @name BMP280
 */
/**
 * @class Accelerometer
 * @docs http://johnny-five.io/api/accelerometer/
 * @name MPU-6050
 */

/**
 * @class GPS
 * @docs http://johnny-five.io/api/gps/
 * @name NEO-M8N
 */

/**
 * @class Light - Photocells
 * @docs: http://johnny-five.io/api/light/
 *
 */

/**
 * @class Proximity - Ultrasonic US-100
 * @docs: http://johnny-five.io/api/proximity/
 * @docs: (Hardware) - https://www.adafruit.com/product/4019
 * TODO: Be mindful of the following when wiring up to Blackboard (from adafruit.com):
 *     When the jumper on the back is removed, it acts like an HC-SR04 with a trigger and echo pin.
 * @see Note about installing `pingfirmata` when using this on Pi
 */


//-- Arduino Mega
/**
 * @class Servo - 160 degrees of rotation
 * @doc: http://johnny-five.io/api/servo
 * @see: https://www.sparkfun.com/products/9065
 * Voltage: 4.8-6.0 Volts
 * Torque: 16.6/20.8 oz-in. (4.8/6.0V)
 * Speed: 0.15/0.10 sec/60° (4.8/6.0V)
 * Rotation: ~160°
 */

/**
 * @class Motor - Edf motors
 * Note: 2 of them can use this motor board: https://www.sparkfun.com/products/14129
 * @doc: https://learn.sparkfun.com/tutorials/ardumoto-kit-hookup-guide
 */

const identity = x => x

const defaultOptions = {
    name: null,
    config: {},
}

export class BaseComponent extends Meta {
    static type = Led
    name = 'MyComponent'
    options = {
        ...defaultOptions
    }
    instance = null
    controller = null

    constructor(options=defaultOptions) {
        const opts = { ...defaultOptions, ...options }
        super(opts)
        this.options = opts
        this.name = this.options.name
        this.controller = this.controller || null
        this.instance = this.instance || null
    }

    /**
     * @method init - Initialize the Johnny-five device/component
     * This is called after the board's "ready" event
     * @param {Controller} controller
     * @returns {Promise<BaseComponent>}
     */
    init(controller) {
        (super.init || identity)(controller)
        this.controller = controller
        return Promise.resolve(this)
    }

    /**
     * @method destroy - Teardown logic
     * @returns {Promise<BaseComponent>}
     */
    tearDown() {
        try {
            this.instance.off()
        } catch(err) {
            console.error(err)
        }
        return Promise.resolve(this)
    }

    /**
     * @method update - Handle a state change.  Ie. accept a new value
     * from a store
     * @param state
     */
    update(state) {
    }
}




export class StatusLed extends BaseComponent {
    static type = Led
    name = 'SystemStatus'

    async init(controller) {
        await super.init(controller)
        this.instance = new Led({
            board: controller.board,
            pin: this.options.pin
        })
        return Promise.resolve(this)
    }

    update(state) {
        return state ? this.turnOn() : this.turnOff()
    }

    turnOn() {
        this.instance?.on()
        return Promise.resolve(this)
    }

    turnOff() {
        this.instance?.stop().off()
        return Promise.resolve(this)
    }
}


