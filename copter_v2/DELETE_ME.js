const { BehaviorSubject, Observable, of, pipe } = require('rxjs')
const { tap } = require('rxjs/operators')


const rotation = new BehaviorSubject({
    x: 0,
    y: 0,
    z: 0
})


const delta = new BehaviorSubject({
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0
})


module.exports = {
    Observable,
    BehaviorSubject,
    of,
    pipe,
    tap,
    rotation,
    delta
}



