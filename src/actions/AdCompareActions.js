import {ADD_VEHICLE_TO_COMPARE} from "./actionTypes";

export const addVehicleToCompare = (vehicle) => {
    return {
        type: ADD_VEHICLE_TO_COMPARE,
        payload: vehicle
    };
};

