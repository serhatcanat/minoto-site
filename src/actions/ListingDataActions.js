import {SET_LISTING_DATA} from "./actionTypes";


// export const setListingDataSuccess = (vehicle) => {
//     return {
//         type: SET_LISTING_DATA_SUCCESS,
//         payload: vehicle
//     };
// };

export const setListingData = (vehicle) => {
    return {
        type: SET_LISTING_DATA,
        payload: vehicle
    };
};
