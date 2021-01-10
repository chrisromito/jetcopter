import { Radians } from '../physics/angle'
import { Mss } from '../physics/acceleration'


export interface RotationState {
    pitch: Radians,
    roll: Radians,
    yaw: Radians
}


export type Orientation = -3 | -2 | -1 | 0 | 1 | 2 | 3


export interface RotationDeltaState {
    acceleration: Mss,
    inclination: Radians,
    orientation: Orientation,
    x: Mss,
    y: Mss,
    z: Mss
}
