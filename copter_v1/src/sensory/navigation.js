import { BehaviorSubject } from 'rxjs'
import { Altimeter, GPS } from 'johnny-five'
import { EventComponent } from '../component'
import { Speed } from '../shared/conversions'
import { SensoryPins } from '../constants'

//-- Constants
export const ALTIMETER_CONTROLLER = 'BMP280'
export const GPS_PINS = { rx: 1, tx: 2 }

export const Navigation = new BehaviorSubject({
    lat: 0,
    long: 0,
    speed: 0, // Meters per second (calculated)
    speedKnots: 0, // Knots (what GPS gives us)
    direction: 0,
    altitude: 0,  // Altitude in meters
})


/**
 * @class GPS - Updates the BehaviorSubject based on GPS sensory data
 * the 'onChange' method encapsulates any magic
 */
export class Gps extends EventComponent {
    static type = GPS
    name = 'Gps'
    subject = Navigation
    options = {
        pins: SensoryPins.gps
    }
    events = {
        change: ({ instance, subject })=> {
            const { altitude, course, latitude, longitude, speed } = instance
            return subject.next({
                altitude,
                course,
                lat: latitude,
                long: longitude,
                speed: knotsToMps(speed),
                speedKnots: speed,
            })
        }
    }
}

const knotsToMps = Speed.toMps(Speed.conversions.knot)


export class Alt extends EventComponent {
    static type = Altimeter
    name = 'Alt'
    subject = Navigation
    options = {
        controller: ALTIMETER_CONTROLLER
    }
    events = {
        change: ({ instance, subject })=> subject.next({ altitude: instance.meters })
    }

}
