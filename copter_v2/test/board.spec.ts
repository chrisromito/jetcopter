import { assert } from 'chai'
// @ts-ignore
import { Board } from 'johnny-five'
import { Pi } from '../src/boards'

describe(`Ensure that we can run mocha with typescript`, ()=> {
    it(`"it" worked`, ()=> {
        assert.isTrue(true, 'Assertion worked')
    })

    it(`We can obtain an instance of the board (Pi)`, done => {
        try {

            const board = Pi()
            assert.isOk(board, `We got a board instance`)
            assert.instanceOf(board, Board)
            done()
        } catch(error) {
            done(error)
        }
    })
})
