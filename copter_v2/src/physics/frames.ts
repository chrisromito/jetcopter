/**
 * @module physics/frames - The frames we operate in for all physics-related calculations
 * @see: https://andrew.gibiansky.com/blog/physics/quadcopter-dynamics/ for illustrative purposes
 */
import { Radians, RadSec} from './angle'

export const enum LimbPosition {
    frontLeft,
    frontRight,
    backLeft ,
    backRight
}

// Defined by the ground; gravity points to negative Z
export interface InertialFrame {
    x: Radians,
    y: Radians,
    z: Radians
}

export interface InertialVelocity {
    x: RadSec,
    y: RadSec,
    z: RadSec
}

// The orientation of the body
// Rotor axes point to positive Z, arms point to X and Y
export interface BodyPosition {
    x: Radians,
    y: Radians,
    z: Radians
}

export interface BodyVelocity {
    x: RadSec,
    y: RadSec,
    z: RadSec
}
