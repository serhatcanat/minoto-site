import store from "data/store"

const initialState = {
	impressions: false,
	productData: false,
	dealerData: false,
};

function gaReducer(state = initialState, action) {
	if (action.type === "SET_LISTING_DATA") {
		return Object.assign({}, state, {
			impressions: action.payload
		});
	}
	else if (action.type === "SET_PRODUCT_DATA") {
		return Object.assign({}, state, {
			productData: action.payload
		});
	}
	else if (action.type === "SET_DEALER_DATA") {
		return Object.assign({}, state, {
			dealerData: action.payload
		});
	}
	return state;
};
export default gaReducer;

// Actions
export function setImpressions(payload) {
	return { type: "SET_LISTING_DATA", payload }
};

export function setProductData(payload) {
	return { type: "SET_PRODUCT_DATA", payload }
};

export function setDealerData(payload) {
	return { type: "SET_DEALER_DATA", payload }
};

// Controller Functions

export function resetData() {
	store.dispatch(setImpressions(false));
	store.dispatch(setProductData(false));
	store.dispatch(setDealerData(false));
};