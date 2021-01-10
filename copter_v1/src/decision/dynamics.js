/**
 * @module decision/dynamics - Functions for computing
 * dynamics acting on the body frame.
 * Torque, thrust, etc.
 */
import * as R from 'ramda'
import { map, multiply, view } from 'ramda'
import { Dimensions, Dynamics, MotorLenses } from './constants'

const pow = exponent => base => Math.pow(base, exponent)

const square = pow(2)

/**
 * @typedef {Number} Velocity - Angular velocity of a motor in (rad/s)/V
 */


// Thrust = Velocity ^2
export const Thrust = square

export const ThrustVector = velocityList => [0, 0, Dynamics.thrustCoefficient * R.sum(velocityList)]


//-- Torque equations for operating on the body frame
const axisTorque = R.pipe(
    map(square), // Number[]
    list => list.reduce((diff, n)=> diff ? diff - n : n, null),  // Number
    multiply(Dimensions.motorDistance)
)


const viewLenses = lensList => valueList => lensList.map(lens => view(lens, valueList))

export const pitchTorque = R.pipe(
    viewLenses(MotorLenses.pitchAxis),
    axisTorque
)

export const rollTorque = R.pipe(
    viewLenses(MotorLenses.rollAxis),
    axisTorque
)


// export const totalZAxisTorque = velocityList =>





