import { Meta } from '../utils/meta'


const tenToThe = n => Math.pow(10, n)


export const Scale = {
    kilo: tenToThe(3),
    hecto: tenToThe(2),
    deca: tenToThe(1),
    base: 1,
    deci: tenToThe(-1),
    centi: tenToThe(-2),
    milli: tenToThe(-3),
    micro: tenToThe(-6),
    nano: tenToThe(-9),
    pico: tenToThe(-12)
}


// Base Unit of measurement
export class Unit extends Meta {
    static Scale = Scale
    static factor: number = Scale.base

    static isBase(unit: Unit): boolean {
        return unit[Symbol.species].factor === Scale.base
    }

    isBase(): boolean {
        const Ctor = this.constructor[Symbol.species]
        return Ctor.isBase(this)
    }

    toBase(): number {
        return this._value / this.constructor[Symbol.species].factor
    }

    fromBase(): number {
        return this._value * this.constructor[Symbol.species].factor
    }

    convert(factorKey: string): number {
        const factor: number = Scale[factorKey]
        const base = this.toBase()
        return base * factor
    }
}



