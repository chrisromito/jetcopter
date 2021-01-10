import { clamp } from 'ramda'
import { Controller } from '../controller'
import { BehaviorSubject } from 'rxjs'
import { ESC, Servo } from 'johnny-five'
import { BaseComponent } from '../component'

// const SERVO_PIN = 10  // Blue wire
export const SERVO_CONFIG = {
    // board: Mega,
    // pin: SERVO_PIN,
    deviceRange: [0, 160],
    range: [0, 160],
    type: 'standard'
}


export const ArmPositions = {
    frontLeft: 0,
    frontRight: 1,
    backLeft: 2,
    backRight: 3
}

const zeroToOneHundred = clamp(0, 100)

// The following options are set in the BLHeli_32 config
const BLHELI_OPTIONS = {
    pwmRange: [1040, 1960],
    neutral: 1500,
    device: 'FORWARD_BRAKE_REVERSE'
    // pwmFrequency: '35kHz',
    // motorTiming: '16deg'
}

export class Edf extends BaseComponent {
    options = {
        ...BLHELI_OPTIONS
    }
    subject = null

    _update(value) {
        this.instance.throttle(value)
    }

    /**
     * @method update - Alias for `ESC.throttle()`
     * @param {Number} value
     * @returns {this}
     */
    update(value) {
        const throttle = zeroToOneHundred(value)
        this._update(throttle)
        return !this.subject
            ? this
            : (
                this.subject.next({
                    ...this.subject.value,
                    throttle
                }),
                    this
            )
    }
}

export class EdfRotator extends BaseComponent {
    position = ArmPositions.frontLeft

    update(value) {
        if (!this.subject) {
            return this
        }
        return this.subject.next({
            ...this.subject.value,
            angle: value,
        })
    }
}









