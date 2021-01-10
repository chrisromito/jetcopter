/**
 * @module sensory - Sensory System:
 * - Navigation (GPS + Altimeter)
 * - Rotation & RotationDelta (IMU w/ gyroscope & accelerometer)
 * - Surroundings (Proximity Sensors)
 */
import { SensoryBoard } from './board'
import {
    Navigation, Gps, Alt
} from './navigation'
import { Rotation, RotationDelta, RotationSensor } from './rotation'
import { FrontProximity, BottomProximity, Surroundings } from './surroundings'


export const board = new SensoryBoard([
    Alt,
    Gps,
    RotationSensor,
    // FIXME: CR 2020-Nov-14 - These need to be wired to a custom board setup
    // FrontProximity,
    // BottomProximity
])

export const SensorySubjects = {
    rotation: Rotation,
    rotationDelta: RotationDelta,
    surroundings: Surroundings,
    navigation: Navigation,
}



