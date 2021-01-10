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


export class BaseComponent extends Meta {
    static type = Led
    static defaultOptions = {}
    name = 'MyComponent'
    options = {}
    instance = null
    controller = null
    _isInit = false

    /**
     * @method init - Initialize the Johnny-five device/component
     * This is called after the board's "ready" event
     * @param {Controller} controller
     * @returns {Promise<Controller>}
     */
    async init(controller) {
        if (this._isInit) {
            return Promise.resolve(controller)
        }
        this.controller = controller
        const ctor = this.staticKey('type')
        this.instance = new ctor(this.componentOptions)
        await this.onInit(controller)
        this._isInit = true
        return controller
    }

    async onInit() {
        return Promise.resolve(this)
    }

    get componentOptions() {
        return {...this.options, board: this.controller?.board}
    }
}


/**
 * @typedef {function(object): *} EventHandler
 * @typedef {{ String: EventHandler }} EventMap
 */

/**
 * @class EventComponent
 * @extends BaseComponent
 * @property {EventMap} events
 */
export class EventComponent extends BaseComponent {
    eventBuilder = ComponentEventBuilder
    events = {}

    onInit() {
        return super.onInit()
            .then(arg => (this.setEvents(), arg))
    }

    setEvents() {
        const eventBuilder = new this.eventBuilder(this.events)
        eventBuilder.setEvents(this, this.instance)
    }
}


/**
 * @class ComponentEventBuilder
 * @param {EventMap} [events={}]
 */
export class ComponentEventBuilder {
    #events = {}
    constructor(events={}) {
        this.#events = events
    }

    setEvents(component, instance) {
        Object.keys(this.#events)
            .forEach(eventName =>
                instance.on(eventName, this.handleEvent(eventName, component))
            )
        return { component, instance }
    }

    handleEvent(eventName, component) {
        return event =>
            this.#events[eventName]({
                ...component,
                event,
                eventName,
                component
            })
    }
}


//-- Pi
/**
 * @class Led - LED status lights
 * @docs: http://johnny-five.io/api/led/
 */


//-- Blackboard Controller

/**
 * @class Proximity - Ultrasonic US-100
 * @docs: http://johnny-five.io/api/proximity/
 * @docs: (Hardware) - https://www.adafruit.com/product/4019
 * @docs: Wiring Guide - https://learn.adafruit.com/ultrasonic-sonar-distance-sensors/python-circuitpython
 * TODO: Be mindful of the following when wiring up to Blackboard (from adafruit.com):
 *     When the jumper on the back is removed, it acts like an HC-SR04 with a trigger and echo pin.
 * @see Note about installing `pingfirmata` when using this on Pi
 */

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
 * Note: This requires the UBlox Arduino Library
 * See :https://learn.sparkfun.com/tutorials/sparkfun-gps-neo-m9n-hookup-guide
 */

/**
 * @class Light - Photocells
 * @docs: http://johnny-five.io/api/light/
 *
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

