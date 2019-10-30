import {GET_VEHICLE_DETAIL, GET_VEHICLE_DETAIL_ERROR, GET_VEHICLE_DETAIL_SUCCESS} from "./actionTypes";

export const getVehicleDetail = (id) => {
    return {
        type: GET_VEHICLE_DETAIL,
        payload: id
    };
};

export const getVehicleDetailSuccess = (vehicle) => {
    return {
        type: GET_VEHICLE_DETAIL_SUCCESS,
        payload: vehicle
    };
};

export const getVehicleDetailError = () => {
    return {
        type: GET_VEHICLE_DETAIL_ERROR,
    };
};

