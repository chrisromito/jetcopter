/**
 * @module conversions - Convert to/from various units of measurement
 */

// name: {n per MPS}
export const SPEED_CONVERSIONS = {
    knot: 1.9438445
}

export const Speed = n => ({
    value: ()=> n,
    map: fn => Speed(fn(n)),
    ap: value => Speed(n(value)),
    toMps: nPerMps => Speed.of(n / nPerMps)
})

Speed.constructor = Speed
Speed.of = n => Speed(n)
Speed.conversions = SPEED_CONVERSIONS

/**
 * @property {function(Number): function(Number): Number} toMps
 * @param {Number} conversionValue - Value of one of the key/value pairs in `Speed.conversions`
 * @returns {function(Number): Number}
 * @see Speed.conversions
 * @example
 * > const knotsToMps = Speed.toMps(Speed.conversions.knot)
 * > knotsToMps(5) //=> 2.57200058436
 */
Speed.toMps = conversionValue => Speed.ap(n => n / conversionValue)


// name: {n per meter}
const DISTANCE_CONVERSIONS = {

}
