/**
 * @module config/pins - Pin configuration constants used internally by johnny-five
 *
 */


//-- Pi pin outs
export const PERIPHERAL_PIN_OUTS = {
    FRONT_LEFT_SERVO: 26,
    FRONT_LEFT_MOTOR: 19,
    FRONT_RIGHT_SERVO: 13,
    FRONT_RIGHT_MOTOR: 6,
    BACK_LEFT_SERVO: 21,
    BACK_LEFT_MOTOR: 20,
    BACK_RIGHT_SERVO: 16,
    BACK_RIGHT_MOTOR: 12,
    PERIPHERAL_LED: 5
}

export const SENSORY_PIN_OUTS = {
    FRONT_PROXIMITY: 23,
    BOTTOM_PROXIMITY: 24
}


export const IIC_PIN_OUTS = {
    SDA: 2,
    SCL: 3
}


// Pin modes used by johnny-five.js
export const PIN_MODES = {
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

export const iicModes = {
    WRITE: 0,
    READ: 1,
    CONTINUOUS_READ: 2,
    STOP_READING: 3
}
