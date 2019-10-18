import {SET_VEHICLE_TO_RESERVATION} from "../actions/actionTypes";

const INIT_STATE = {
    data: [],
};

const setVehicleToReservation = (state, action) => {
    return ({
        data: [action.payload]
    });
};

const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        return handlers.hasOwnProperty(action.type)
            ? handlers[action.type](state, action)
            : state;
    }
};

export const reservationReducer = createReducer(INIT_STATE, {
    [SET_VEHICLE_TO_RESERVATION]: setVehicleToReservation
});
