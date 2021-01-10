/**
 * @module states/limb - Interfaces for representing servo positions, ESC throttle values,
 * and combinatorics around the two to assess their affects on BodyPosition & BodyVelocity
 */
import { ComponentState, ComponentStatus } from './component'
import { Degrees, Radians } from '../physics/angle'
import { LimbPosition } from '../physics/frames'

export { LimbPosition, ComponentState, ComponentStatus }

export interface MotorState extends ComponentState {
    // Note: Throttle is in %
    throttle: number,
    lastThrottle?: number
}

export interface ServoState extends ComponentState {
    // NOTE: This is in degrees, while frames are always in Rad
    angle: Degrees,
    lastAngle?: Degrees
}

export interface ArmState {
    position: LimbPosition,
    motor: MotorState,
    servo: ServoState,
    // Constantly updated to reflect how the force from the EDF
    // will impact the BodyPosition & BodyVelocity, since each EDF
    // is attached to a servo that allows it to rotate about the z-axis
    // toward the front and back of the copter
    zAngle: Radians
}
