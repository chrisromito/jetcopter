import { Observer } from 'rxjs'
import { ESC } from 'johnny-five'
import { MotorState } from '../../states/limb'

export const ArmEsc = ({ options }: escArgs)=> {
    // @ts-ignore
    const esc = new ESC(options)
    return <Observer<MotorState>> {
        esc,
        next: (state: MotorState) => !state.throttle ? esc.brake() : esc.throttle(state.throttle),
        error: (e)=> esc.brake(),
        complete: ()=> esc.brake()
    }
}

interface escConfig {
    pin: number,
    pwmRange: number[],
    neutral: number,
    device: string,
    [propName: string]: any
}


interface escArgs {
    options: escConfig,
    [propName: string]: any
}
