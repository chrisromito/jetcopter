import { assert } from 'chai'
import { BehaviorSubject } from 'rxjs'
import sinon from 'sinon'
import { board } from './shared/board'
import { degreesToRadians } from '../src/physics/angle'
import { NavigationState } from '../src/states/navigation'
import { ProximityState } from '../src/states/proximity'
import { RotationState, RotationDeltaState } from '../src/states/rotation'
import { SensorySystem } from '../src/components/sensors'


describe(`The sensory system provides sensory input that we can use to determine inertial frames & body frames`, ()=> {
    afterEach(()=> {
        sinon.restore()
    })

    it(`Navigation observable gives us our latitude, longitude, and altitude`, async ()=> {
        try {
            const initialState: NavigationState = {
                ...defaultNavState,
                ...defaultAltitude
            }
            const subject = new BehaviorSubject(initialState)
            const subjectSpy = sinon.spy(subject, 'next')

            const { navigation } = SensorySystem(board)
            const navSubscription = navigation.subscribe(subject)

            // Since the GPS will emit every 50ms, we can probably just mock a 60ms
            // delay and inspect the changes
            await waitFor(50)
            const navigationState = subject.value

            assert.isTrue(subjectSpy.called, `The 'next()' method of the subject was invoked via the observable`)
            assert.notDeepEqual(initialState, navigationState, `Navigation subject value was updated`)
            assert.notEqual(navigationState.lat, initialState.lat, `Latitude was updated`)
            assert.notEqual(navigationState.long, initialState.long, `Longitude was updated`)
            navSubscription.unsubscribe()
            return Promise.resolve()
        } catch(error) {
            return Promise.reject(error)
        }
    })

    it(`Rotation observable reflects the state of the body frame`, async ()=> {
        try {
            const subject = new BehaviorSubject(defaultRotation)
            const subjectSpy = sinon.spy(subject, 'next')

            const { rotation } = SensorySystem(board)
            const rotationSubscription = rotation.subscribe(subject)

            // Wait 10ms, then inspect the data
            await waitFor(10)
            const rotationState = subject.value

            assert.isTrue(subjectSpy.called, `The 'next()' method of the subject was invoked via the observable`)
            assert.notDeepEqual(defaultRotation, rotationState, `Rotation subject value was updated`)
            assert.notEqual(rotationState.pitch, defaultRotation.pitch, `Pitch was updated`)
            rotationSubscription.unsubscribe()
            return Promise.resolve()
        } catch(error) {
            return Promise.reject(error)
        }
    })

    it(`RotationDelta observable reflects the state of the body frame's acceleration`, async ()=> {
        try {
            const subject = new BehaviorSubject(defaultRotationDelta)
            const subjectSpy = sinon.spy(subject, 'next')

            const { rotationDelta } = SensorySystem(board)
            const rotationDeltaSubscription = rotationDelta.subscribe(subject)

            // Wait 10ms, then inspect the data
            await waitFor(10)
            const rotationDeltaState = subject.value

            assert.isTrue(subjectSpy.called, `The 'next()' method of the subject was invoked via the observable`)
            assert.notDeepEqual(defaultRotationDelta, rotationDeltaState, `Rotation delta subject value was updated`)
            rotationDeltaSubscription.unsubscribe()
            return Promise.resolve()
        } catch(error) {
            return Promise.reject(error)
        }
    })

    it(`Proximity observable reflects the state of the front and bottom proximity sensors`, async ()=> {
        try {
            const subject = new BehaviorSubject(defaultProximity)
            const subjectSpy = sinon.spy(subject, 'next')

            const { proximity } = SensorySystem(board)
            const proximitySubscription = proximity.subscribe(subject)

            // Wait 10ms, then inspect the data
            await waitFor(10)
            const proximityState = subject.value

            assert.isTrue(subjectSpy.called, `The 'next()' method of the subject was invoked via the observable`)
            assert.notDeepEqual(defaultProximity, proximityState, `Proximity subject value was updated`)
            proximitySubscription.unsubscribe()
            return Promise.resolve()
        } catch(error) {
            return Promise.reject(error)
        }
    })
})


const waitFor = ms => new Promise(resolve =>
    setTimeout(()=> resolve(true), ms)
)

const defaultNavState = {
    lat: 40.201024,
    long: -77.200274
}

const defaultAltitude = {
    altitude: 146
}


const oneDegree = degreesToRadians(1)

const defaultRotation: RotationState = {
    pitch: oneDegree,
    roll: oneDegree,
    yaw: oneDegree
}

const defaultRotationDelta: RotationDeltaState = {
    orientation: 1,
    acceleration: 1,
    inclination: oneDegree,
    x: 1,
    y: 1,
    z: 1
}


const defaultProximity: ProximityState = {
    front: 1,
    bottom: 10
}
