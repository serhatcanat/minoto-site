import {
    ADD_VEHICLE_TO_LVP,
    ADD_VEHICLE_TO_LVP_SUCCESS,
} from "./actionTypes";

// Rvp : Recently Viwed Products

export const addVehicleToLVPSuccess = (vehicle) => {
    return {
        type: ADD_VEHICLE_TO_LVP_SUCCESS,
        payload: vehicle
    };
};

export const addVehicleToLVP = (vehicle) => {
    return {
        type: ADD_VEHICLE_TO_LVP,
        payload: vehicle
    };
};
