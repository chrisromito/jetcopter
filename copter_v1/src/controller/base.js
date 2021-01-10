/**
 * @module component/base - Base class for Controllers
 * Controllers are boards + components
 */
import { Board } from 'johnny-five'
import { IS_DEV } from '../constants'
import { mapEvents, asyncReduce } from '../utils'


const defaultOptions = {
    debug: IS_DEV,
    repl: false
}

export class Controller {
    board = null
    options = {...defaultOptions}
    _isInit = false
    components = []

    async init(context={}) {
        if (this._isInit) {
            return Promise.resolve(context)
        }
        this._isInit = true
        return new Promise((resolve, reject)=> {
            try {
                this.board = new Board({...this.options })
                this.board.on('ready', ()=>
                    this.onInit(context)
                        .then(resolve)
                )
            } catch(error) {
                reject(error)
            }
        })
    }

    async onInit(context) {
        const init = component => component.init(this)
        return Promise.all( this.components.map(init) )
            .then(()=> context)
    }
}
