const square = n => Math.pow(n, 2)

// Jetcopter dimensions (millimeters)
export const copterWidth = 406.4
export const copterLength = copterWidth
export const copterHypotenuse = (
    square(copterWidth) + square(copterLength)
)
export const copterMotorDistance = copterHypotenuse / 2

export const Dimensions = {
    width: copterWidth,
    length: copterLength,
    hypotenuse: copterHypotenuse,
    motorDistance: copterMotorDistance
}


// Rotational Dynamics
export const thrustCoefficient = 1.15

const torqueCoefficientNewtonMetersPerAmp = (
    2.12206 / 1000
)

export const torqueCoefficient = torqueCoefficientNewtonMetersPerAmp * 1000

export const Dynamics = {
    thrustCoefficient,  // K
    torqueCoefficient
}

// millimeters
export const motorDimensions = {
    outer: {
        diameter: 64,
        radius: 32
    },
    inner: {
        diameter: 60,
        radius: 30
    },
    shaft: {
        // The center part of the EDF, where the brushless
        // motor connects to the fan)
        diameter: 25.8,
        radius: 25.8 / 2
    },
    height: 30,
    wallThickness: 2,
    outerSurfaceArea: 6031.8578948924,
    innerSurfaceArea: 5654.8667764616,
    endSurfaceArea: 389.55748904514,
    outerVolume: 96509.726318279,
    innerVolume: 84823.001646925,
    solidVolume: 11686.724671354
}



const circleArea = radius => Math.PI * square(radius)


export const motorFanSweptArea = circleArea(motorDimensions.inner.radius) - circleArea(motorDimensions.shaft.radius)
