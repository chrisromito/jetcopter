/**
 * @module sensory/board - Blackboard
 */
import { Controller } from '../controller'
import { IS_DEV } from '../constants'

const defaultOptions = {
    debug: IS_DEV,
    repl: false
}

export class SensoryBoard extends Controller {
    constructor(components) {
        super()
        this.components = components
    }
}
export default SensoryBoard
