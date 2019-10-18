import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import generic from "data/store.generic";
import modals from "data/store.modals";
import user from "data/store.user";
import listing from "data/store.listing";
import ga from "data/store.ga";
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/index';
import {adCompareReducer} from "../reducers/AdCompareReducer";
import {vehicleReducer} from "../reducers/VehicleReducer";
import {reservationReducer} from "../reducers/ReservationReducer";

const rootReducer = combineReducers({
	generic: generic,
	modals: modals,
	user: user,
	listing: listing,
	ga: ga,
    adCompare: adCompareReducer,
    vehicle: vehicleReducer,
	reservation: reservationReducer,
	//checkout: checkout,
});

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer,{},composeEnhancers(applyMiddleware(sagaMiddleware)));


// const store = createStore(rootReducer, applyMiddleware(sagaMiddleware)
// 	//for chrome redux extension
//
//     // ,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

sagaMiddleware.run(rootSaga);

export default store;
