import {ADD_VEHICLE_TO_COMPARE, GET_VEHICLE_FROM_COMPARE,GET_VEHICLE_FROM_COMPARE_SUCCESS} from "./actionTypes";

export const addVehicleToCompare = (vehicle) => {
    return {
        type: ADD_VEHICLE_TO_COMPARE,
        payload: vehicle
    };
};

export const getVehicleFrom = (id) => {
    return {
        type: GET_VEHICLE_FROM_COMPARE,
        payload: id
    };
};

export const getVehicleFromCompare = (vehicle) => {
    return {
        type: GET_VEHICLE_FROM_COMPARE_SUCCESS,
        payload: vehicle
    };
};
