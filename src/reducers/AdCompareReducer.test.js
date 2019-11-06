import {adCompareReducer} from './AdCompareReducer'
import * as types from '../actions/actionTypes'


describe('ad compare reducer', () => {

    it('should return the initial state', () => {
        expect(adCompareReducer(undefined, {})).toEqual(
            {
                "data": [],
            })
    })

})
