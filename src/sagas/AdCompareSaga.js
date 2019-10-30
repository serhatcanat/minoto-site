import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {ADD_VEHICLE_TO_COMPARE, DELETE_VEHICLE_FROM_COMPARE} from "../actions/actionTypes";
import {addVehicleToCompareSuccess} from "../actions"
import {AdCompareService} from "../services/AdCompareService";
//Functions
import {CompareListService, LocalStorageItem, LocalStorageService} from "../functions";

const _adCompareService = new AdCompareService();
const _compareListService = new CompareListService();
const _localStorageService = new LocalStorageService();

function* saveCompareList(action) {
    try {
        const response = yield call(_adCompareService.detail, action.payload);
        const lStorage = _localStorageService.get(LocalStorageItem.compareList);

        if (_compareListService.isFull(lStorage)) {
            _localStorageService.unshift(LocalStorageItem.compareList, action.payload, true);
        } else {
            _localStorageService.update(LocalStorageItem.compareList, action.payload);
        }

        yield put(addVehicleToCompareSuccess(response.payload));
    } catch (error) {
        console.error(error);
    }
}

function* deleteCompareList(action) {
    try {
        const response = yield call(_adCompareService.delete, action.payload);
        const lStorage = _localStorageService.get(LocalStorageItem.compareList);
        const filteredItems = lStorage.filter(item => item.id !== action.payload);
        _localStorageService.set(LocalStorageItem.compareList, filteredItems);
        yield put(addVehicleToCompareSuccess(response.payload));
    } catch (error) {
        console.error(error);
    }
}

export function* saveCompareListWatcher() {
    yield takeEvery(ADD_VEHICLE_TO_COMPARE, saveCompareList);
}

export function* deleteCompareListWatcher() {
    yield takeEvery(DELETE_VEHICLE_FROM_COMPARE, deleteCompareList);
}

export default function* rootSaga() {
    yield all([
        fork(saveCompareListWatcher),
        fork(deleteCompareListWatcher),
    ]);
}
