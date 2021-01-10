import * as R from 'ramda'

export const isNotNull = R.complement(R.isNil)

export const isBoolean = R.is(Boolean)

export const isString = R.is(String)

export const isNumber = R.allPass([
    R.is(Number),
    R.complement(isNaN),
    isNotNull
])

export const isFunction = R.is(Function)

export const isArray = R.curry(Array.isArray)

export const isObject = R.complement(
    R.anyPass([
        isBoolean,
        isString,
        isNumber,
        R.isNil,
        isFunction
    ])
)

export const toJson = R.ifElse(
    isString,
    R.identity,
    value => JSON.stringify(value)
)


export const toJs = R.ifElse(
    isString,
    x => JSON.parse(x),
    R.identity
)
