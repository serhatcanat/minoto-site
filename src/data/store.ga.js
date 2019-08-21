import store from "data/store"

const initialState = {
	listingData: false,
	productData: false,
};

function gaReducer(state = initialState, action) {
	if (action.type === "SET_LISTING_DATA") {
		return Object.assign({}, state, {
			listingData: action.payload
		});
	}
	else if (action.type === "SET_PRODUCT_DATA") {
		return Object.assign({}, state, {
			productData: action.payload
		});
	}
	return state;
};
export default gaReducer;

// Actions
export function setListingData(payload) {
	return { type: "SET_LISTING_DATA", payload }
};

export function setProductData(payload) {
	return { type: "SET_PRODUCT_DATA", payload }
};

// Controller Functions

export function resetData() {
	store.dispatch(setListingData(false));
	store.dispatch(setProductData(false));
};