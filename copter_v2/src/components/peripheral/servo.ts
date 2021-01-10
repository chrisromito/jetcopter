import { Observer } from 'rxjs'
import { Servo } from 'johnny-five'
import { ServoState } from '../../states/limb'

export const ArmServo = ({ options }: servoArgs)=> {
    const servo = new Servo(options)
    return <Observer<ServoState>>{
        servo,
        next: (state: ServoState)=> servo.to(state.angle),
        error: (e)=> servo.center(),
        complete: ()=> servo.center()
    }
}


interface servoConfig {
    pin: number,
    deviceRange: number[],
    range: number[],
    type: string,
    [propName: string]: any
}


interface servoArgs {
    options: servoConfig,
    [propName: string]: any
}
