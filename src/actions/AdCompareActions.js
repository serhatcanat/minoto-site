import {
    ADD_VEHICLE_TO_COMPARE,
    ADD_VEHICLE_TO_COMPARE_SUCCESS,
    DELETE_VEHICLE_FROM_COMPARE,
    DELETE_VEHICLE_FROM_COMPARE_SUCCESS,
} from "./actionTypes";

export const addVehicleToCompareSuccess = (vehicle) => {
    return {
        type: ADD_VEHICLE_TO_COMPARE_SUCCESS,
        payload: vehicle
    };
};

export const addVehicleToCompare = (vehicle) => {
    return {
        type: ADD_VEHICLE_TO_COMPARE,
        payload: vehicle
    };
};

export const deleteVehicleFromCompareSuccess = (id) => {
    return {
        type: DELETE_VEHICLE_FROM_COMPARE_SUCCESS,
        payload: id
    };
};

export const deleteVehicleFromCompare = (id) => {
    return {
        type: DELETE_VEHICLE_FROM_COMPARE,
        payload: id
    };
};
