
import {ADD_VEHICLE_TO_COMPARE} from "../actions/actionTypes";

const INIT_STATE = {
    data: [],
};

const addVehicleToCompare = (state, action) => {
    // todo: find right file for this controls
    let index = state.data.findIndex(el => el.id === action.payload.id);

    let data = state.data;
    if (data.length >= 4) {

    }
    if (index == -1)
        return ({
            ...state,
            data: [...state.data, action.payload]
        });
    return state;
};


const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        return handlers.hasOwnProperty(action.type)
            ? handlers[action.type](state, action)
            : state;
    }
};

export const adCompareReducer = createReducer(INIT_STATE, {
    [ADD_VEHICLE_TO_COMPARE]: addVehicleToCompare
});
