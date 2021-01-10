import { Observable } from 'rxjs'
// @ts-ignore
import { Board, GPS, IMU, Proximity, SIP } from 'johnny-five'
import { NavigationObservable } from './navigation'
import { NavigationState } from '../../states/navigation'
import { ProximityObservable, ProximityState } from './proximity'
import { RotationObservable, RotationObserver } from './rotation'


export const SensorySystem = (board: Board): Sensory => {
    const { navigation, gps, sip } = NavigationObservable({ board }, { board })
    const { imu, rotation, rotationDelta }: RotationObserver = RotationObservable({
        options: { board }
    })
    const { frontProximity, bottomProximity, proximity } = ProximityObservable(board)
    return {
        sensors: {
            gps,
            sip,
            imu,
            frontProximity,
            bottomProximity
        },
        navigation,
        proximity,
        rotation,
        rotationDelta
    }
}
export default SensorySystem


export interface Sensory extends RotationObserver {
    navigation: Observable<NavigationState>,
    proximity: Observable<ProximityState>,
    sensors: {
        gps: GPS,
        sip: SIP,
        imu: IMU,
        frontProximity: Proximity,
        bottomProximity: Proximity
    }
}
