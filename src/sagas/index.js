import {all} from 'redux-saga/effects';
import AdCompareSaga from './AdCompareSaga';
import VehicleSaga from './VehicleSaga';
import ReservationSaga from './ReservationSaga';
import LvpSaga from "./LvpSaga";


export default function* rootSaga(getState) {
    yield all([
        AdCompareSaga(),
        ReservationSaga(),
        VehicleSaga(),
        LvpSaga(),
    ]);
}
