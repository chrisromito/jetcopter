/**
 * @module rotation - IMU (9-dof via gyro + accel) component wrapper.
 *
 * Controller: MPU-6050
 * @see: https://www.adafruit.com/product/3886
 * @doc: http://johnny-five.io/api/imu/
 *
 * Adafruit's docs: https://learn.adafruit.com/mpu6050-6-dof-accelerometer-and-gyro/overview
 */
import { IMU } from 'johnny-five'
import { interval, Observable } from 'rxjs'
import { map, share } from 'rxjs/operators'
import { gToMss } from '../../physics/acceleration'
import { degreesToRadians } from '../../physics/angle'
import { RotationDeltaState, RotationState } from '../../states/rotation'
export * from '../../states/rotation'


export const RotationObservable = ({ options }: { options: object }): RotationObserver => {
    const imu = new IMU({ ...defaultRotationOptions, ...options })
    const data$ = interval(10)
        .pipe(
            map(()=> imu),
            share()
        )
    const rotation = data$.pipe( map(updateRotation) )
    const rotationDelta = data$.pipe( map(updateDelta) )
    return {
        imu,
        rotation,
        rotationDelta
    }
}

export interface RotationObserver {
    rotation: Observable<RotationState>,
    rotationDelta: Observable<RotationDeltaState>,
    [propName: string]: any
}


const defaultRotationOptions = {
    controller: 'MPU6050',
    freq: 10  // Emit the 'data' event every 10ms
}


export const updateRotation = (imu: IMU): RotationState => {
    const { pitch, roll, yaw } = {
        ...imu.gyro,
        ...imu.accelerometer
    }

    return {
        pitch: degreesToRadians(pitch),
        roll: degreesToRadians(roll),
        yaw: degreesToRadians(yaw)
    }
}


export const updateDelta = (imu: IMU): RotationDeltaState => {
    const { x, y, z, inclination, orientation, acceleration } = {
        ...imu.gyro,
        ...imu.accelerometer
    }

    // IMU component receives x, y, & z in GForce, we need to convert to m/s^-2
    return <RotationDeltaState>{
        orientation,
        acceleration: gToMss(acceleration),
        inclination: degreesToRadians(inclination),
        x: gToMss(x),
        y: gToMss(y),
        z: gToMss(z)
    }
}
