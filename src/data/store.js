import { combineReducers, createStore } from 'redux'
import generic from "data/store.generic";
import modals from "data/store.modals";
import user from "data/store.user";
import listing from "data/store.listing";
//import checkout from "data/store.checkout";

const rootReducer = combineReducers({
	generic: generic,
	modals: modals,
	user: user,
	listing: listing,
	//checkout: checkout,
})

const store = createStore(rootReducer);

export default store;