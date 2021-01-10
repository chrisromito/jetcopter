import { add, subtract } from 'ramda'
// @ts-ignore
import { Board, ESC, Servo } from 'johnny-five'
import { Observer } from 'rxjs'
import { ArmServo } from './servo'
import { ArmEsc } from './esc'
import { ArmState, MotorState, ServoState } from '../../states/limb'
import { BlHeliConfig, ServoConfig } from '../../config/arm'
import { Degrees, degreesToRadians, Radians } from '../../physics/angle'
import { LimbPosition } from '../../physics/frames'
import { PERIPHERAL_PIN_OUTS } from '../../config/pins'


export const Arm = (board: Board, position: LimbPosition): ArmObserver => {
    const pins = LimbPins[position]
    const servo = ArmServo({
        options: {
            board,
            ...ServoConfig,
            pin: pins.servo,
        }
    })

    const esc = ArmEsc({
        options: {
            board,
            ...BlHeliConfig,
            pin: pins.motor,
        }
    })
    return {
        esc,
        servo,
        position,
        zAngle: servoPositionToZAngle(position),
        next: (state: ArmState) => {
            // Update servo & esc where appropriate
            if (state.servo.lastAngle !== state.servo.angle) {
                servo.next(state.servo)
            }
            if (state.motor.lastThrottle !== state.motor.throttle) {
                esc.next(state.motor)
            }
            return state
        },
        error: (e: Error) => (
            servo.error(e),
            esc.error(e),
            e
        ),
        complete: ()=> (
            servo.complete(),
            esc.complete()
        )
    }
}

export interface ArmObserver extends Observer<ArmState> {
    esc: Observer<MotorState>,
    servo: Observer<ServoState>,
    position: LimbPosition,
    zAngle: degreePredicate
}


export const servoPositionToZAngle = (position: LimbPosition)=> (angle: Degrees): Radians =>
    degreesToRadians(
        limbZAngle[position](angle)
    )


/**
 *
 * On the left side of the copter, the top of the servo is on the left side.  Thus, when the servo
 * is at 160 deg, the EDF is at an angle of -80 degrees, relative to the z-axis.
 *
 * When servo angle = 0, the EDF's on the left side will have an angle = 80 relative to the z-axis.  Meaning the top of the EDF is closer to the front
 * of the copter, while the bottom of the EDF is closer to the back of the copter.  This gives us a center offset of 80.
 *
 * On the right side, when servo angle = 0, EDF angle = -80.  Servo angle = 80, EDF angle = 0.  Meaning the center offset is -80
 *
 * I deliberately bolted the EDF to the servo, and center the servos prior to attaching the EDF to ensure
 * we have a 1:1 mapping.  Ie. Left center point = 80, right center point = -80
 *
 * Note in this awful ASCII diagram below, the servo is supposed to be "behind" the EDF.  The EDF gets bolted directly to the servo via a 3d printed bracket
 * @see: ../../../../designs/Edf_bracket.stl
 *
 * Front of copter
 *     Z-axis           EDF (left-side)
 *       |         | \\\\\\\\\\\\\\ |
 *       |         |    160 deg     |
 *       | 80 deg  | [-*  Servo ]   |
 *       |         |    0 deg       |
 *                 vvv Airflow    vvv
 */
export const zLeft: degreeFunc = subtract(ServoConfig.center)

export const zRight: degreeFunc = add(ServoConfig.center * -1)

interface degreeFunc {
    (angle: Degrees): Degrees
}

interface degreePredicate {
    (angle: Degrees): Radians
}

export const limbZAngle = {
    [LimbPosition.frontLeft]: zLeft,
    [LimbPosition.frontRight]: zRight,
    [LimbPosition.backLeft]: zLeft,
    [LimbPosition.backRight]: zRight
}


export const LimbPins = {
    [LimbPosition.frontLeft]: {
        servo: PERIPHERAL_PIN_OUTS.FRONT_LEFT_SERVO,
        motor: PERIPHERAL_PIN_OUTS.FRONT_LEFT_MOTOR
    },
    [LimbPosition.frontRight]: {
        servo: PERIPHERAL_PIN_OUTS.FRONT_RIGHT_SERVO,
        motor: PERIPHERAL_PIN_OUTS.FRONT_RIGHT_MOTOR
    },
    [LimbPosition.backLeft]: {
        servo: PERIPHERAL_PIN_OUTS.BACK_LEFT_SERVO,
        motor: PERIPHERAL_PIN_OUTS.BACK_LEFT_MOTOR
    },
    [LimbPosition.backRight]: {
        servo: PERIPHERAL_PIN_OUTS.BACK_RIGHT_SERVO,
        motor: PERIPHERAL_PIN_OUTS.BACK_RIGHT_MOTOR
    }
}

