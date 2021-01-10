export const asyncReduce = (reducer, initialValue=[]) => async list => {
    let value = initialValue
    const len = list.length
    let i = 0
    for (i; i < len; i++) {
        value = await reducer(value, list[i], i, list)
    }
    return value
}


export const asyncMap = fn => async list => {
    let accum = []
    const len = list.length
    let i = 0
    for (i; i < len; i++) {
        const value = await fn(list[i], i, list)
        accum.push(value)
    }
    return accum
}
