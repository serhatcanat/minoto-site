import {combineReducers} from 'redux';
import {vehicleReducer} from "./VehicleReducer";
import {adCompareReducer} from "./AdCompareReducer";
import {reservationReducer} from "./ReservationReducer";


export default () => combineReducers({
    adCompare: adCompareReducer,
    vehicle: vehicleReducer,
    reservation: reservationReducer,
});
