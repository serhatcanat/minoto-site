import { combineReducers, createStore } from 'redux'
import generic from "data/store.generic";
import modals from "data/store.modals";

const rootReducer = combineReducers({
	generic: generic,
	modals: modals,
})

const store = createStore(rootReducer);

export default store;