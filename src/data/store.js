import { combineReducers, createStore } from 'redux'
import generic from "data/store.generic";
import modals from "data/store.modals";
import user from "data/store.user";
//import checkout from "data/store.checkout";

const rootReducer = combineReducers({
	generic: generic,
	modals: modals,
	user: user,
	//checkout: checkout,
})

const store = createStore(rootReducer);

export default store;