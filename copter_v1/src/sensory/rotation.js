import { BehaviorSubject } from 'rxjs'
import { IMU } from 'johnny-five'
import { compose } from 'ramda'
import { EventComponent } from '../component'


export const Rotation = new BehaviorSubject({
    pitch: 0,  // Angle in degrees
    roll: 0,  // Angle in degrees
    yaw: 0,  // Angle in degrees
})

export const RotationDelta = new BehaviorSubject({
    x: 0,  // x-axis in G forces
    y: 0,  // y-axis in G forces
    z: 0,  // z-axis in G forces
    inclination: 0,  // Magnitude of acceleration in degrees
    orientation: 0,  // The orientation of the device (-3, -2, -1, 1, 2, 3)
    acceleration: 0  // Magnitude in acceleration in G forces
})


export const IMU_CONTROLLER = 'MPU6050'


export class RotationSensor extends EventComponent {
    static type = IMU
    name = 'Rotation'
    options = {
        controller: IMU_CONTROLLER
    }
    subject = Rotation
    subjectDelta = RotationDelta
    events = {
        change: compose(updateRotation, updateRotationDelta)
    }
}


const updateRotation = ({ component, instance })=> {
    const { subject } = component
    const { pitch, roll, yaw } = {
        ...instance.gyro,
        ...instance.accelerometer
    }
    subject.next({ pitch, roll, yaw })
    return { component, instance }
}


const updateRotationDelta = ({ component, instance })=> {
    const { subjectDelta } = component
    const { x, y, z, inclination, orientation, acceleration, pitch, roll, yaw } = {
        ...instance.gyro,
        ...instance.accelerometer
    }
    subjectDelta.next({ x, y, z, inclination, orientation, acceleration })
    return { component, instance }
}

