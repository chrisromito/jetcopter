/**
 * @module sensory/store - Navigation, rotation, surrounding state & actions
 */


const Navigation = {
    lat: 0,
    long: 0,
    speedKnots: 0, // Knots (what GPS gives us)
    speed: 0, // Meters per second (calculated)
    direction: 0,
    altitude: 0,  // Altitude in centimeters
}


const Rotation = {
    pitch: 0,  // Angle in degrees
    roll: 0,  // Angle in degrees
    yaw: 0,  // Angle in degrees
    x: 0,  // x-axis in G forces
    y: 0,  // y-axis in G forces
    z: 0,  // z-axis in G forces
    inclination: 0,  // Magnitude of acceleration in degrees
    orientation: 0,  // The orientation of the device (-3, -2, -1, 1, 2, 3)
    acceleration: 0  // Magnitude in acceleration in G forces
}


const Surroundings = {
    front: 0,  // Centimeters
    bottom: 0  // Centimeters
}

