import { SET_VEHICLE_TO_RESERVATION} from "./actionTypes";

export const setVehicleToReservation = (vehicle) => {
    return {
        type: SET_VEHICLE_TO_RESERVATION,
        payload: vehicle
    };
};

