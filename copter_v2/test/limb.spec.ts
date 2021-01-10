import { assert } from 'chai'
import { BehaviorSubject } from 'rxjs'
import sinon from 'sinon'
import { Arm } from '../src/components/peripheral/limb'
import { ArmState, ComponentStatus, LimbPosition, MotorState, ServoState } from '../src/states/limb'
import { BlHeliConfig, ServoConfig } from '../src/config/arm'
import { board } from './shared/board'
import { Degrees, degreesToRadians, Radians } from '../src/physics/angle'


describe(`The arm component gives us the ability to update a servo and an ESC based on the state of a Subject`, ()=> {
    let motorState: MotorState = {
        status: ComponentStatus.default,
        throttle: BlHeliConfig.neutral
    }

    let servoState: ServoState = {
        status: ComponentStatus.default,
        angle: 110
    }

    let armState: ArmState = {
        position: LimbPosition.frontLeft,
        motor: motorState,
        servo: servoState,
        zAngle: 0
    }

    afterEach(()=> {
        sinon.restore()
    })

    it(`Arm state is reflected into the servo & esc`, ()=> {
        const arm = Arm(board, armState.position)
        const spy = sinon.spy(arm, 'next')
        const servoSpy = sinon.spy(arm.servo, 'next')
        const escSpy = sinon.spy(arm.esc, 'next')
        const nextState = getNextState(armState)
        arm.next(nextState)

        assert.isTrue(spy.calledOnce, 'Arm.next gets invoked')
        assert.isTrue(servoSpy.calledOnce, 'Invoking arm.next also calls servo.next()')
        assert.isTrue(escSpy.calledOnce, 'Invoking arm.next also calls esc.next()')

        // Do it again, but with the same state to ensure that the child.next()
        // methods only get called when the state changes
        arm.next({
            ...nextState,
            motor: {
                ...nextState.motor,
                lastThrottle: nextState.motor.throttle
            },
            servo: {
                ...nextState.servo,
                lastAngle: nextState.servo.angle
            }
        })

        assert.isTrue(servoSpy.calledOnce, `servo.next did not get called because the state didn't change`)
        assert.isTrue(escSpy.calledOnce, `esc.next did not get called because the state didn't change`)
    })

    it(`Arms are valid observers`, ()=> {
        const arm = Arm(board, armState.position)
        const spy = sinon.spy(arm, 'next')
        const servoSpy = sinon.spy(arm.servo, 'next')
        const escSpy = sinon.spy(arm.esc, 'next')

        const subject = new BehaviorSubject(armState)

        const subscription = subject.subscribe(arm)

        // The arm will receive the initial subject value
        assert.isTrue(spy.calledOnce, 'Arm.next gets invoked')
        assert.isTrue(servoSpy.calledOnce, 'Invoking arm.next also calls servo.next()')
        assert.isTrue(escSpy.calledOnce, 'Invoking arm.next also calls esc.next()')

        const firstArg = spy.getCall(0).args[0]
        assert.deepEqual(firstArg, armState, `nextState was passed into arm.next()`)
        assert.deepEqual(firstArg, subject.value, `The subject's value === nextState`)

        // Update the subject & ensure the value gets passed down
        const nextState = getNextState(armState)
        subject.next(nextState)
        const firstArgSecondCall = spy.getCall(1).args[0]
        assert.deepEqual(firstArgSecondCall, nextState, `State was passed into arm.next()`)
        assert.deepEqual(firstArgSecondCall, subject.value, `Subject's value was passed into arm.next()`)
        // Cleanup
        subscription.unsubscribe()
    })

    it(
        `Z-angle offsets reflect the angle that downward force is being applied on the body-frame
        based on the servo configuration & physical position on the copter`, ()=> {
        const leftArm = Arm(board, LimbPosition.frontLeft)
        const leftAngle: Degrees = 120
        const leftAtOneHundredTwenty: Radians = leftArm.zAngle(leftAngle)
        assert.equal(leftAtOneHundredTwenty, degreesToRadians(ServoConfig.center - leftAngle))
    })

    it(`Z-angle functions are equal for the front-left & back-left arms.  The front-right and back-right are also equal`, ()=> {
        const Arms = {
            frontLeft: Arm(board, LimbPosition.frontLeft),
            frontRight: Arm(board, LimbPosition.frontRight),
            backLeft: Arm(board, LimbPosition.backLeft),
            backRight: Arm(board, LimbPosition.backRight)
        }

        const angle = armState.servo.angle
        assert.equal(
            Arms.frontLeft.zAngle(angle),
            Arms.backLeft.zAngle(angle),
            `Left side gives us the same values`
        )
        assert.equal(
            Arms.frontRight.zAngle(angle),
            Arms.backRight.zAngle(angle),
            `Right side gives us the same values`
        )
    })
})


const getNextState = (armState: ArmState): ArmState=> ({
    ...armState,
    motor: nextMotor(armState),
    servo: nextServo(armState)
})


const nextMotor = (armState: ArmState): MotorState => {
    const { throttle } = armState.motor
    return {
        ...armState.motor,
        lastThrottle: throttle,
        throttle: throttle + 10
    }
}

const nextServo = (armState: ArmState): ServoState => {
    const { angle } = armState.servo
    return {
        ...armState.servo,
        lastAngle: angle,
        angle: angle + 1
    }
}
