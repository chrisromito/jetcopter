/**
 * @module states/navigation - Interfaces for figuring out where the copter is in the world
 * Note: "heading" is in degrees, see image below for illustrative purposes
 * @see: https://en.wikipedia.org/wiki/Points_of_the_compass#/media/File:Compass_Card_B+W.svg
 */
import { Meter } from '../physics/distance'
import { Degrees } from '../physics/angle'


export interface Coordinates {
    lat: number, // latitude
    long: number  // longitude
}

export interface Altitude {
    altitude: Meter,
    temperature?: number | null,  // Surrounding air temp in Celsius
    pressure?: number | null,  // Barometric pressure (kPa)
}

export type NavigationState = Coordinates & Altitude

export interface Bearing {
    // Direction we're facing in degrees (0-360).  Note: Absolute North = 0, east = 90, south = 180, west = 270
    heading: Degrees,
    timestamp: Date
}

export interface Navigation {
    // Where did we start?
    start: NavigationState,
    // Where are we now?
    current: NavigationState,
    // Where do we want to be?
    destination: NavigationState
}

// Default location: Carlisle, PA 17013
export const defaultNavState = {
    lat: 40.201024,
    long: -77.200274
}

export const defaultAltitude = {
    altitude: 146
}
