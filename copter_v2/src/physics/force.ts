/**
 * @module force - Force calculations
 *
 * Tau (Τ) = Thrust
 *     - Max thrust at full throttle = 750g = 7.35498749 newtons
 *     - Based on the manufacturer datasheets
 *
 * P = Power
 * p = Air Density (NOTE this is lowercase)
 * Vh = air velocity when hovering
 *
 *
 * P = Τ * Vh
 * A = Area swept out by rotor
 * Vh = √(Τ / 2pA)
 *
 * FIXME: Update thrust equations based on information outlined in the docs linked below
 * @see: http://www.rcex.cz/kestazeni/EDF_THR3.pdf
 * @see: https://www.wattflyer.com/forums/attachment.php?attachmentid=47263&d=1195410990
 *
 */
import R from 'ramda'
import { RadSec } from './angle'
import { G } from './mass'
import { Kt, Kv, Motor, MotorTorque, MotorVelocity, MotorPower, motorFanSweptArea, Newton, Percent } from './motors'


export const DEFAULT_AIR_DENSITY = 1.2
const MAX_THRUST_GRAMS: G = 750
const MAX_THRUST_NEWTONS: Newton = 7.35498749


const calculateTorqueThrustProportionalityConstant = ()=> {
    const maxThrottle = 1

    // P = ((Kv * KT) / Kt) * T * w
    const maxVelocity = Motor.velocity(maxThrottle)
    const maxPower = Motor.powerFromThrottle(maxThrottle)

    // (P / T * w) / Kt = Kv * KT
    // Derive the left side of the above
    const powerOverThrustVelocityOverKt = R.divide(
        R.divide(
            maxPower,
            R.multiply(
                MAX_THRUST_NEWTONS,
                maxVelocity
            )
        ),
        Kt
    )
    // The above then becomes: ((P / T * w) / Kt) / Kv = KT
    return powerOverThrustVelocityOverKt / Kv
}


const KThrust = calculateTorqueThrustProportionalityConstant()


const square = R.partialRight(Math.pow, [2])
const squareRoot = Math.sqrt

// Tau = Thrust = (( (Kv * KThrust * sqrt(2 * airDensity * areaOfFan)) / Kt) * w) ^2
const squareRootTwoPA = squareRoot(R.product([2, DEFAULT_AIR_DENSITY, motorFanSweptArea]))

const thrustPartial = R.divide(
    R.product([
        Kv,
        KThrust,
        squareRootTwoPA
    ]),
    Kt
)


export const MotorThrust: thrustFunc = R.pipe(
    R.partial(R.multiply, [thrustPartial]),
    square
)

interface thrustFunc {
    (velocity: RadSec): Newton
}
