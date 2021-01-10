import { Scale, Unit } from './types'

export type Degrees = number

export type Radians = number

export const degreesToRadians = (degrees: Degrees): Radians => degrees * Math.PI / 180

export const radiansToDegrees = (rad: Radians): Degrees => rad * 180 / Math.PI


export class Angle extends Unit {
    static factor: number = Scale.base

    static toRadians(degrees: Degrees) {
        const Ctor = this[Symbol.species]
        return Ctor.of(degreesToRadians(degrees))
    }

    static toDegrees(radians: Radians) {
        const Ctor = this[Symbol.species]
        return Ctor.of(radiansToDegrees(radians))
    }
}

// Angular Velocity

export type Rpm = number // Rotations per minute

export type RadSec = number // Radians per second

export const rpmToRadPerSec = (rpm: Rpm): RadSec => {
    const radPerMinute = rotationToRadian(rpm)
    return radPerMinute * 60
}

const rotationToRadian = (n: number): Radians => {
    const degrees: Degrees = n * 360
    return degreesToRadians(degrees)
}
