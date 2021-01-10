import { identity } from 'ramda'


const unWrap = Ctor => value =>
    !(value instanceof Ctor)
        ? value
        : value.value()


export class Meta {
    constructor(value) {
        this._value = value
    }

    static get [Symbol.species]() {
        return this
    }

    static of(...values) {
        const Ctor = this[Symbol.species]
        return new Ctor(...values)
    }

    staticKey(key) {
        const Ctor = this.constructor[Symbol.species]
        return Ctor[key]
    }

    value() {
        return this._value
    }

    map(actor = identity) {
        const Ctor = this.constructor[Symbol.species]
        return new Ctor(
            actor(this.value())
        )
    }

    flatMap(actor = identity) {
        const Ctor = this.constructor[Symbol.species]
        const lift = unWrap(Ctor)
        return actor(
            lift(this.value())
        )
    }
}
