//-- Time
import { Scale, Unit } from './types'

export type Sec = number


export class Second extends Unit {}


export class Ms extends Unit {
    static factor = Scale.milli
}


export class Ns extends Unit {
    static factor = Scale.nano
}


export class Time {
    static Second = Second
    static Ms = Ms
    static Ns = Ns
}

