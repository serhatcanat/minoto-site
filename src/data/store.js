import { combineReducers, createStore } from 'redux'
import generic from "data/store.generic";

const rootReducer = combineReducers({
	generic: generic,
})

const store = createStore(rootReducer);

export default store;