import defaults from "data/config";

const initialState = {
  loading: false,
  currentPage: '',
  mobile: (window.innerWidth <= defaults.mobileBreakPoint),
  mobileBreakPoint: defaults.mobileBreakPoint,
  mapsAPIkey: defaults.mapsAPIkey,
  windowWidth: window.innerWidth,
};

function globalReducer(state = initialState, action) {
	if (action.type === "SET_LOADING") {
		return Object.assign({}, state, {
			loading: action.payload
		});
	}
	else if (action.type === "SET_MOBILE") {
		return Object.assign({}, state, {
			mobile: action.payload
		});
	}
	else if (action.type === "SET_WW") {
		return Object.assign({}, state, {
			windowWidth: action.payload
		});
	}
	else if (action.type === "SET_PAGE") {
		return Object.assign({}, state, {
			currentPage: action.payload
		});
	}
	return state;
};
export default globalReducer;

// Actions
export function setLoading(payload) {
	return { type: "SET_LOADING", payload }
};

export function setMobile(payload) {
	return { type: "SET_MOBILE", payload }
};

export function setWw(payload) {
	return { type: "SET_WW", payload }
};

export function setPage(payload) {
	return { type: "SET_PAGE", payload }
};