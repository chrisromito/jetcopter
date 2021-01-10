import { Board, Proximity } from 'johnny-five'
import { combineLatest, interval, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { Distance } from '../../physics/distance'
import { ProximityState } from '../../states/proximity'
import { SENSORY_PIN_OUTS } from '../../config/pins'

export { ProximityState }

export const ProximityObservable = (board: Board): ProximityObserver => {
    const options = {
        board,
        controller: 'HCSR04'
    }
    const frontProximity = new Proximity({
        ...options,
        pin: SENSORY_PIN_OUTS.FRONT_PROXIMITY
    })
    const bottomProximity = new Proximity({
        ...options,
        pin: SENSORY_PIN_OUTS.BOTTOM_PROXIMITY
    })

    // @ts-ignore
    const frontObserver = proximityObserver(frontProximity)
    // @ts-ignore
    const bottomObserver = proximityObserver(bottomProximity)
    const proximity = combineLatest(frontObserver, bottomObserver)
        .pipe(
            map(([front, bottom])=> ({
                front,
                bottom
            }))
        )

    return {
        frontProximity,
        bottomProximity,
        proximity
    }
}

export interface ProximityObserver {
    frontProximity: Proximity,
    bottomProximity: Proximity,
    proximity: Observable<ProximityState>
}


const proximityObserver = (proximity: ProximityCm)=>
    interval(10)
        .pipe(
            map(()=> proximity.cm),
            distinctUntilChanged(),
            map(
                cm => new Distance.Cm(cm).toMeter()
            )
        )


interface ProximityCm {
    cm: number
}
