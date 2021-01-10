import { Scale, Unit } from './types'

export type G = number  // Grams


export class Kg extends Unit {
    static factor = Scale.kilo
}

export class Gram extends Unit {}

export class Mg extends Unit {
    static factor = Scale.milli
}


export class Weight {
    static Gram = Gram
    static Kg = Kg
    static Mg = Mg
}

export class Mass extends Weight {}
