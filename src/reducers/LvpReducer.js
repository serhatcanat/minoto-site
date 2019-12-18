import {ADD_VEHICLE_TO_LVP} from "../actions/actionTypes";
import {LVPService, LocalStorageService, LocalStorageItem, CompareListService} from '../functions'

const _localStorageService = new LocalStorageService();
const _compareListService = new CompareListService();

const INIT_STATE = {
    data: _localStorageService.get(LocalStorageItem.lvpList) || [],
};

const addVehicleToLVPSuccess = (state, action) => {
    if(_compareListService.isFull(state.data,6)){
        state.data.pop();
        return ({
            ...state,
            data: [action.payload,...state.data]
        });
    }

    return ({
        ...state,
        data: [...state.data, action.payload]
    });
    // return state;
};

const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        return handlers.hasOwnProperty(action.type)
            ? handlers[action.type](state, action)
            : state;
    }
};


export const lvpReducer = createReducer(INIT_STATE, {
    [ADD_VEHICLE_TO_LVP]: addVehicleToLVPSuccess,
});
