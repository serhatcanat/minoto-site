import store from "data/store"

const initialState = {
	filtersExpanded: false,
	filterData: false,
	listingData: false,
	filterQuery: {},
	listingQuery: {},
};

function listingReducer(state = initialState, action) {
	if (action.type === "SET_FILTERS_EXPANSION") {
		return Object.assign({}, state, {
			filtersExpanded: action.payload
		});
	}
	else if (action.type === "SET_FILTER_DATA") {
		return Object.assign({}, state, {
			filterData: action.payload
		});
	}
	else if (action.type === "SET_FILTER_QUERY") {
		return Object.assign({}, state, {
			filterQuery: action.payload
		});
	}
	else if (action.type === "SET_LISTING_DATA") {
		return Object.assign({}, state, {
			listingData: action.payload
		});
	}
	else if (action.type === "SET_LISTING_QUERY") {
		return Object.assign({}, state, {
			listingQuery: action.payload
		});
	}
	return state;
};
export default listingReducer;

// Actions
export function setFiltersExpansion(payload) {
	return { type: "SET_FILTERS_EXPANSION", payload }
};

export function setFilterData(payload) {
	return { type: "SET_FILTER_DATA", payload }
};

export function setFilterQuery(payload) {
	return { type: "SET_FILTER_QUERY", payload }
};

export function setListingData(payload) {
	return { type: "SET_LISTING_DATA", payload }
};

export function setListingQuery(payload) {

	return { type: "SET_LISTING_QUERY", payload }
};

// Controller Functions

export function resetListingData() {
	store.dispatch(setListingData(false));
	store.dispatch(setFilterData(false));
	store.dispatch(setListingQuery({}));
	store.dispatch(setFilterQuery({}));
};