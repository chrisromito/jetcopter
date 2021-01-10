
// The following options are set in the BLHeli_32 config
export const BlHeliConfig = {
    pwmRange: [1040, 1960],
    neutral: 1500,
    device: 'FORWARD_BRAKE_REVERSE'
    // pwmFrequency: '35kHz',
    // motorTiming: '16deg'
}


const servoRange = [0, 160]

const center = Math.max(...servoRange) / 2

export const ServoConfig = {
    center,
    deviceRange: servoRange,
    range: servoRange,
    type: 'standard'
}
