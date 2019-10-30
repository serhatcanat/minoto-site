import {ADD_VEHICLE_TO_COMPARE, DELETE_VEHICLE_FROM_COMPARE} from "../actions/actionTypes";
import {CompareListService,LocalStorageService,LocalStorageItem} from '../functions'

const _localStorageService = new LocalStorageService();
const _compareListService = new CompareListService();
const INIT_STATE = {
    data: _localStorageService.get(LocalStorageItem.compareList) || [],
};


const addVehicleToCompareSuccess = (state, action) => {

    if(_compareListService.isFull(state.data)){
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

const deleteVehicleFromCompareSuccess = (state, action) => {
    const filteredItems = state.data.filter(item => item.id !== action.payload);
    return ({
        data: filteredItems
    });
};

const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        return handlers.hasOwnProperty(action.type)
            ? handlers[action.type](state, action)
            : state;
    }
};

export const adCompareReducer = createReducer(INIT_STATE, {
    [ADD_VEHICLE_TO_COMPARE]: addVehicleToCompareSuccess,
    [DELETE_VEHICLE_FROM_COMPARE]: deleteVehicleFromCompareSuccess,
});
