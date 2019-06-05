import defaults from "data/config"

const initialState = {
  loading: false,
  currentPage: {
  	key: "",
  	data: {}
  },
  messages: [],
  mobile: (window.innerWidth <= defaults.mobileBreakPoint),
  mobileBreakPoint: defaults.mobileBreakPoint,
  scrollPos: 0,
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
	else if (action.type === "SET_SCROLLPOS") {
		return Object.assign({}, state, {
			scrollPos: action.payload
		});
	}
	else if (action.type === "SET_PAGE") {
		return Object.assign({}, state, {
			currentPage: action.payload
		});
	}
	else if (action.type === "ADD_MESSAGE") {
		return Object.assign({}, state, {
			messages: [...state.messages, action.payload]
		});
	}
	else if (action.type === "CLEAR_MESSAGES") {
		return Object.assign({}, state, {
			messages: []
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

export function setScrollPos(payload) {
	return { type: "SET_SCROLLPOS", payload }
};

export function setPage(payload) {
	return { type: "SET_PAGE", payload }
};

export function addMessage(payload) {
	return { type: "ADD_MESSAGE", payload }
};

export function clearMessages(payload) {
	return { type: "CLEAR_MESSAGES", payload }
};