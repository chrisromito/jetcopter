import { EventEmitter } from 'events'


export class TestComponent extends EventEmitter {
    value = {}
    constructor(options) {
        super()
        this.options = options
        this.setValue(options)
    }

    setValue(value={}) {
        Object.entries({ ...this.value, ...value })
            .forEach(([k, v])=> this[k] = v)
    }
}

export default TestComponent
