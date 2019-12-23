import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {ADD_VEHICLE_TO_LVP} from "../actions/actionTypes";
import {addVehicleToLVPSuccess} from "../actions"
//Functions
import {CompareListService, LocalStorageItem, LocalStorageService} from "../functions";
import {LvpService} from "../services/LvpService";

const _lvpService = new LvpService();
const _compareListService = new CompareListService();
const _localStorageService = new LocalStorageService();

function* saveLvpList(action) {
    try {
        const response = yield call(_lvpService.detail, action.payload);
        const lStorage = _localStorageService.get(LocalStorageItem.lvpList);

        if (_compareListService.isFull(lStorage,6)) {
            _localStorageService.unshift(LocalStorageItem.lvpList, action.payload, true);
        } else {
            _localStorageService.update(LocalStorageItem.lvpList, action.payload);
        }

        yield put(addVehicleToLVPSuccess(response.payload));
    } catch (error) {
        console.error(error);
    }
}


export function* saveLvpListWatcher() {
    yield takeEvery(ADD_VEHICLE_TO_LVP, saveLvpList);
}


export default function* rootSaga() {
    yield all([
        fork(saveLvpListWatcher),
    ]);
}
