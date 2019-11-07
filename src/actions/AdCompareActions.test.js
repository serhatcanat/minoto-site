import * as actions from './AdCompareActions'
import * as types from './actionTypes'

describe('Compare Actions', () => {

    it('should create an action to add to comapre list', () => {
        const payload = {sampleKey: 'sample test'};
        const expectedAction = {
            type: types.ADD_VEHICLE_TO_COMPARE,
            payload
        }
        expect(actions.addVehicleToCompare(payload)).toEqual(expectedAction)
    })

    it('should create an action to add to comapre list success', () => {
        const payload = {sampleKey: 'sample test'};
        const expectedAction = {
            type: types.ADD_VEHICLE_TO_COMPARE_SUCCESS,
            payload
        }
        expect(actions.addVehicleToCompareSuccess(payload)).toEqual(expectedAction)
    })

    it('should create an action to delete from compare list', () => {
        const payload = {sampleKey: 'sample val'};
        const expectedAction = {
            type: types.DELETE_VEHICLE_FROM_COMPARE,
            payload
        }
        expect(actions.deleteVehicleFromCompare(payload)).toEqual(expectedAction)
    })

    it('should create an action to delete success from compare list', () => {
        const payload = {sampleKey: 'sample val'};
        const expectedAction = {
            type: types.DELETE_VEHICLE_FROM_COMPARE_SUCCESS,
            payload
        }
        expect(actions.deleteVehicleFromCompareSuccess(payload)).toEqual(expectedAction)
    })
})
