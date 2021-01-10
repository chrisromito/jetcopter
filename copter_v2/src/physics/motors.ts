/**
 * tau (τ) = Torque (calculated via max RPM x throttle %)
 * Tau (Τ) = Thrust
 * Kt = Torque proportionality  constant
 *      - See: https://en.wikipedia.org/wiki/Motor_constants#Motor_torque_constant
 * Kv (upsilon === Kυ) = Proportionality constant (indicating back-EMF generated per RPM)
 *      - See: https://en.wikipedia.org/wiki/Motor_constants#Motor_velocity_constant,_back_EMF_constant
 * I = Input current (can also be derived from: max current * throttle %
 * I0 = Current when there is no load on the motor
 * omega (Ω ω) = Angular velocity
 * Kw = K omega = Angular velocity of the motor
 * P = Power
 *
 * P = (Kv / Kt) * τω
 */
import { divide, multiply } from 'ramda'
import { RadSec, Rpm, rpmToRadPerSec } from './angle'
import { Amp, Joule } from './energy'
import { G} from './mass'

export { motorFanSweptArea } from '../config/dimensions'

export type Percent = number
export type Newton = number
export type Nm = number  // Newton meter


//-- Constants (via configuration and/or datasheets)
const VOLTS = 11.1
const AMPS: Amp = 27
const Ia: Amp = AMPS
const IZero: Amp = 2
const MAX_THRUST_GRAMS: G = 750
const MAX_THRUST_NEWTONS: Newton = 7.35498749

const MOTOR_MAX_KV_RPM: Rpm = 4500  // RPM/V - Taken from manufacturer website
const MOTOR_MAX_KV_RAD: RadSec = rpmToRadPerSec(MOTOR_MAX_KV_RPM)
const MOTOR_MAX_SPEED_RPS = MOTOR_MAX_KV_RAD * VOLTS // RPM


export const Kv = rpmToRadPerSec(MOTOR_MAX_KV_RPM)

export const Kt = 1 / Kv


const iaMinusIZero = Ia - IZero

const throttleAmps = multiply(iaMinusIZero)


export const MotorTorque = (throttle: Percent): Nm => Kt * (throttleAmps(throttle) - IZero)


/**
 * @func MotorVelocity - How fast is the motor spinning?
 * @param {Number} throttle - Throttle %
 * @returns {RadSec} - Velocity in rad/sec
 */
export const MotorVelocity: Vfn = multiply(MOTOR_MAX_SPEED_RPS)


interface Vfn {
    (throttle: Percent): RadSec
}


/**
 * @func MotorPower - Determine the power produced by the motor based on its
 * torque and velocity
 * P = (Kv / Kt) * torque * velocity
 * @param {Nm} torque
 * @param {RadSec} velocity
 * @returns {Joule}
 */
export const MotorPower = (torque: Nm, velocity: RadSec): Joule =>
    multiply(
        multiply(powerConstant, torque),
        velocity
    )

const powerConstant = divide(Kv, Kt)


export const Motor = {
    torque: MotorTorque,
    velocity: MotorVelocity,
    power: MotorPower,
    powerFromThrottle: throttle => Motor.power(Motor.torque(throttle), Motor.velocity(throttle))
}


