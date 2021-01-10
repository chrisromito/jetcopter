import { Scale, Unit } from './types'

export type GForce = number
// Meters / (second ^ 2) aka meters per second per second aka m/s-2
export type Mss = number

export const Gravity: Mss = 9.80665


const mssGForceFactor = 101.97162129779 / 1000

export const gToMss = (g: GForce): Mss => g * mssGForceFactor

export const mssToGForce = (mss: Mss): GForce => mss * mssGForceFactor


export class Acceleration extends Unit {
    static factor: number = Scale.base

    static ofGForce(gForce: GForce) {
        const Ctor = this[Symbol.species]
        return Ctor.of(
            gToMss(gForce)
        )
    }
}
