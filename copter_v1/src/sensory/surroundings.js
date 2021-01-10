import { Proximity } from 'johnny-five'
import { BehaviorSubject } from 'rxjs'
import { EventComponent } from '../component'

export const Surroundings = new BehaviorSubject({
    above: 0,
    below: 0,
    front: 0,
    back: 0,
    left: 0,
    right: 0
})


export class Ultrasonic extends EventComponent {
    static type = Proximity
    static defaultOptions = {
        controller: "HCSR04"
    }
    facing = 'front'
    events = {
        change: ({ facing, instance, subject })=>
            subject.next({
                ...subject.value,
                [facing]: instance.cm
            })
    }
}


export class FrontProximity extends Ultrasonic {
    facing = 'front'
    subject = Surroundings
}


export class BottomProximity extends Ultrasonic {
    facing = 'bottom'
    subject = Surroundings
}

