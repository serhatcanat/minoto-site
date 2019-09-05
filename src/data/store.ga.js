import store from 'data/store'

// Deps
import clone from 'lodash/clone'
import { GA } from 'controllers/ga'

const initialState = {
	impressions: {groups: {}, timestamp: 0},
	productData: false,
	dealerData: false,
	conversionData: {},
};

const conversionTimeout = 1800000;

function gaReducer(state = initialState, action) {
	if (action.type === "SET_IMPRESSIONS") {
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
	else if (action.type === "SET_CONVERSION_DATA") {
		return Object.assign({}, state, {
			conversionData: action.payload
		});
	}
	return state;
};
export default gaReducer;

// Actions
export function setImpressions(payload) {
	return { type: "SET_IMPRESSIONS", payload }
};

export function setProductData(payload) {
	return { type: "SET_PRODUCT_DATA", payload }
};

export function setDealerData(payload) {
	return { type: "SET_DEALER_DATA", payload }
};

export function setConversionData(payload) {
	return { type: "SET_CONVERSION_DATA", payload }
};

// Controller Functions

export function resetData() {
	//store.dispatch(setImpressions({}));
	store.dispatch(setProductData(false));
	store.dispatch(setDealerData(false));
};

export function clearImpressions() {
	store.dispatch(setImpressions(initialState.impressions));
}

export function addImpressionProduct(group, product, totalCount) {
	let impressions = clone(store.getState().ga.impressions);
	//impressions.push(GA.getProductData(product).product);

	if(!impressions.groups[group]){
		impressions.groups[group] = {items: [], totalCount: totalCount};
	}

	impressions.groups[group].items.push(GA.getProductData(product).product);
	impressions.groups[group].totalCount = totalCount;
	impressions.timestamp = Date.now();
	store.dispatch(setImpressions(impressions));
};

export function checkConversion(productID, endFunction) {
	let conversionData = clone(store.getState().ga.conversionData);
	let now = Date.now();

	if(!conversionData[productID] || conversionData[productID] + conversionTimeout <= now){
		conversionData[productID] = now;
		store.dispatch(setConversionData(conversionData));
		endFunction(true);
	}
	else {
		endFunction(false);
	}
}