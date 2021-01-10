import { Scale, Unit } from './types'

export type Meter = number

class Dist extends Unit {
    toMeter(): Meter {
        return this.toBase()
    }
}

export class Mm extends Dist {
    static factor = Scale.milli
}

export class Cm extends Dist {
    static factor = Scale.centi
}

export class Km extends Dist {
    static factor = Scale.kilo
}

export class Distance extends Dist {
    static Mm = Mm
    static Cm = Cm
    static Km = Km
}
