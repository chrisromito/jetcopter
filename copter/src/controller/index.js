import { Board } from 'johnny-five'
import { mapEvents } from '../utils'


class Ctor {}


export const defaultControllerOptions = instance => ({
    name: instance.constructor.name,
    init: (instance, controller) => {
        const component = new instance.ctor({
            ...instance.config,
            board: controller.board
        })
        instance.component = component
        mapEvents(instance.events)(component)
    },
    config: {},
    events: {},
    components: {},
    ctor: Ctor
})


export class Controller {
    config = {}
    board = null
    components = {}
    _listeners = {}

    constructor(config, store, board = null) {
        this.config = config
        this.board = board
        this._listeners = {
            ready: [],
            close: [],
            exit: []
        }
        this.components = this.config.components || {}
    }

    init() {
        this.board = new Board(this.config)
        mapEvents(this._listeners)(this.board)
    }

    initComponent(component) {

    }
}
