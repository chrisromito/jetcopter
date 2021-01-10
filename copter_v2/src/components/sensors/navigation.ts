/**
 * @module components/sensors/navigation - NavigationObservable that emits the current location & altitude
 * based on the data received from our GPS sensor, Altimeter, & Barometer sensors
 *
 * GPS:
 * Sensor: Sparkfun GPS Breakout (NEO-M9N) w/ Qwiic connector & built-in chip antenna
 * @see: https://www.sparkfun.com/products/15733
 * @doc: http://johnny-five.io/api/gps/
 *
 * Barometer & Altimeter:
 * Sensor: BMP-280
 * @see: https://www.adafruit.com/product/2651
 * @doc: http://johnny-five.io/api/system-in-package/
 *
 * Adafruit's tutorial for the BMP280 is also super helpful:
 * @see: https://learn.adafruit.com/adafruit-bmp280-barometric-pressure-plus-temperature-sensor-breakout/overview
 */
// @ts-ignore
import { Board, GPS, SIP } from 'johnny-five'
import { interval, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { NavigationState } from '../../states/navigation'
export * from '../../states/navigation'


// Combine GpsObservable & AltitudeObservable into a (shared) Observable value that emits the current NavigationState
export const NavigationObservable = (gpsOptions, altitudeOptions): NavigationObserver => {
    const gps = new GPS({ ...defaultGpsOptions, ...gpsOptions })
    const sip = new SIP({ ...defaultAltitudeOptions, ...altitudeOptions })
    const navigation = interval(defaultGpsOptions.freq).pipe(
        map((): NavigationState => ({
            lat: gps.latitude,
            long: gps.longitude,
            altitude: sip.altimeter.meters,
            pressure: sip.barometer?.pressure,
            temperature: sip.thermometer?.celsius
        }))
    )
    return {
        gps,
        sip,
        navigation
    }
}

export interface NavigationObserver {
    gps: GPS,
    sip: SIP,
    navigation: Observable<NavigationState>
}

const defaultGpsOptions = {
    freq: 50
}

const defaultAltitudeOptions = {
    controller: 'BMP280',
    freq: 50  // emit 'data' event every 50 ms,
}
