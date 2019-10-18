// eslint-disable-next-line no-unused-vars
import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {VehicleService} from "../services/VehicleService";
import {getVehicleDetailError, getVehicleDetailSuccess} from "../actions/VehicleActions";
import {GET_VEHICLE_DETAIL} from "../actions/actionTypes";

const _vehicleService = new VehicleService();

function* getVehicleDetailSaga(action) {
    try {
        const {id, email} = action.payload;
        const response = yield call(_vehicleService.detail, id, email);
        if (!response.message) {
            yield put(getVehicleDetailSuccess(response.data));
        } else {
            yield put(getVehicleDetailError())
        }
    } catch (error) {
        yield put(getVehicleDetailError())
    }
}

export function* getVehicleDetailWatcher() {
    yield takeEvery(GET_VEHICLE_DETAIL, getVehicleDetailSaga);
}

export default function* rootSaga() {
    yield all([
        fork(getVehicleDetailWatcher),
    ]);
}

