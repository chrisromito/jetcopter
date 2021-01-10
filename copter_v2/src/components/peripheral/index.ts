import { BehaviorSubject } from 'rxjs'
import { Arm, ArmObserver } from './limb'
import { ArmState, ComponentStatus, LimbPosition, MotorState, ServoState } from '../../states/limb'
import { BlHeliConfig } from '../../config/arm'


export interface Peripheral {
    [limbPosition: string]: {
        arm: ArmObserver,
        subject: BehaviorSubject<ArmState>
    }
}


export const PeripheralSystem = (board): Peripheral =>
    positions.reduce((obj, position) => {
        const arm = Arm(board, position)
        const subject: BehaviorSubject<ArmState> = new BehaviorSubject({
            position,
            motor: motorState,
            servo: servoState,
            zAngle: arm.zAngle(servoState.angle)
        })

        obj[position] = {
            arm,
            subject
        }
        return obj
    }, {})

export default PeripheralSystem


const motorState: MotorState = {
    status: ComponentStatus.default,
    throttle: BlHeliConfig.neutral
}


const servoState: ServoState = {
    status: ComponentStatus.default,
    angle: 0
}


const positions = [
    LimbPosition.frontLeft,
    LimbPosition.frontRight,
    LimbPosition.backLeft,
    LimbPosition.backRight
]
