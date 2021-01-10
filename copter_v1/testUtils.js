const timeout =  require('util').promisify(setTimeout)
const { Board, Led, Proximity } = require('johnny-five')

//-- Board setup
const Mega = new Board({
    repl: false,
    debug: true
})

Mega.on('ready', ()=> {
    setLights()
    setProximity()
})

//-- LEDs

let StatusLight = {
    red: null,
    green: null
}

const setLights = ()=> {
    StatusLight.red = createLight(RED_LED_PIN)
    StatusLight.green = createLight(GREEN_LED_PIN)
}

const getLights = ()=> StatusLight

const createLight = pin => new Led({ pin, board: Mega })


//-- Proximity
let prox = null
const getProximity = ()=> prox
const setProximity = ()=> {
    prox = new Proximity({
        board: Mega,
        freq: 100,
        controller: "HCSR04I2CBACKPACK"
    })
}

//-- Constants
const GREEN_LED_PIN = 10
const RED_LED_PIN = 11


module.exports = {
    timeout,
    Mega,
    getLights,
    getProximity
}

