import {GET_VEHICLE_DETAIL_SUCCESS} from "../actions/actionTypes";

const INIT_COMPARE_LIST_SECTION = {
    id: 453,
    title: "",
    price: "",
    image: "",
    postNo: "",
    listingPrice: "",
    description: "",
};

const INIT_STATE = {
    data: [],
};

const getVehicleDetail = (state, action) => ({
    ...state,
    data: action.payload
});


const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        return handlers.hasOwnProperty(action.type)
            ? handlers[action.type](state, action)
            : state;
    }
};

export const vehicleReducer = createReducer(INIT_STATE, {
    [GET_VEHICLE_DETAIL_SUCCESS]: getVehicleDetail
});
