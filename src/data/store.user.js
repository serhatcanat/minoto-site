import extend from 'lodash/extend'
import store from "data/store"
import request from 'controllers/request'
import { serializeArray } from 'functions/helpers'
import { redirect } from 'controllers/navigator'
import { GA } from 'controllers/ga'

const initialState = {
	user: getUserState()[0],
	token: getUserState()[1],
	unreadMessageCount: 0,
};

function getUserState() {
	let appState = [];
	try {
		appState = JSON.parse(localStorage["appState"]);
	} catch(e) {
		localStorage["appState"] = JSON.stringify({});
	}

	if(appState.isLoggedIn && appState.user && appState.authToken) {
		return [appState.user, appState.authToken];
	}
	else {
		return [false, false]
	}
}

function userReducer(state = initialState, action) {
	if (action.type === "SET_USER_DATA") {
		return Object.assign({}, state, {
			user: action.payload
		});
	}
	else if (action.type === "SET_TOKEN") {
		return Object.assign({}, state, {
			token: action.payload
		});
	}
	else if (action.type === "SET_UNREAD_MESSAGE_COUNT") {
		return Object.assign({}, state, {
			unreadMessageCount: action.payload
		});
	}
	return state;
}

export default userReducer;

// Actions
function setUserData(data) {
	return {
		type: 'SET_USER_DATA',
		payload: data
	};
}

function setToken(data) {
	return {
		type: 'SET_TOKEN',
		payload: data
	};
}

function setUnreadMessageCount(data) {
	return {
		type: 'SET_UNREAD_MESSAGE_COUNT',
		payload: data
	};
}

// Functions
export function checkLoginStatus(endFunction = false) {
	if (localStorage["appState"]) {
		let appState = JSON.parse(localStorage["appState"]);
		if (appState.isLoggedIn) {
			/*store.dispatch(setUserData(appState.user));
			store.dispatch(setToken(appState.authToken));*/

			request.get('users/' + appState.user.email, {}, function (payload) {
				if (payload && payload.success) {
					updateUserData(payload);

					if (endFunction) {
						endFunction(true);
					}
				}
				else {
					logout(true);
					if (endFunction) {
						endFunction(false);
					}
				}
			});
		}
		else {
			if (endFunction) {
				endFunction(false);
			}
		}
	}
	else {
		if (endFunction) {
			endFunction(false);
		}
	}

	return false;
}

export function login(form, finalFunction = false) {
	request.post('user/login', serializeArray(form), function (payload) {
		if (payload && payload.success) {
			updateUserData(payload);

			GA.send('loginActions', { action: 'Login', label: 'Giri?? Ba??ar??l??' });

			if (finalFunction) {
				finalFunction(extend({}, payload, { message: "Giri?? Ba??ar??l??" }));
			}
		}
		else {
			logout(true);

			GA.send('loginActions', { action: 'Login', label: payload.message });
			if (finalFunction) {
				finalFunction(payload);
			}
		}
	})
}

export function socialLogin(form, type, finalFunction = false) {
	request.post(`user/social-login/${type}`, form, function (payload) {
		if (payload && payload.success) {
			updateUserData(payload);

			GA.send('loginActions', { action: 'Login', label: type });

			if (finalFunction) {
				finalFunction(extend({}, payload, { message: "Giri?? Ba??ar??l??" }));
			}
		}
		else {
			logout(true);
			//
			// GA.send('loginActions', { action: 'Login', label: payload.message });
			// if (finalFunction) {
			// 	finalFunction(payload);
			// }
		}
	})
}

export function register(form, finalFunction = false) {
	request.post('user/register', serializeArray(form), function (payload) {
		if (payload && payload.success) {
			//updateUserData(payload);
			GA.send('loginActions', { action: 'SignUp', label: 'Kay??t Ba??ar??l??' });

			if (finalFunction) {
				finalFunction(extend({}, payload, { message: "Kay??t Ba??ar??l??" }));
			}
		}
		else {
			if (finalFunction) {
				finalFunction(extend({}, payload, { message: payload.message }));
			}
			logout(true);
		}
	})
}

export function logout(force = false) {
	localStorage["appState"] = JSON.stringify({ isLoggedIn: false, user: false, authToken: false });

	store.dispatch(setUserData(false));
	store.dispatch(setToken(false));

	if (force !== true) {
		redirect('home');
	}
}

export function updateUserData(payload) {
	let userData = extend({}, {
		avatar: "/dummy/images/profile-picture.jpg",
		name: "Kullan??c??",
		email: "",
	}, payload.userData);

	let appState = {
		isLoggedIn: true,
		user: userData,
		authToken: userData.auth_token,
	};

	localStorage["appState"] = JSON.stringify(appState);
	store.dispatch(setUserData(userData));
	store.dispatch(setToken(userData.auth_token));
}

export function updateUserToken(token) {
	if (localStorage["appState"]) {
		let appState = JSON.parse(localStorage["appState"]);
		if(appState.isLoggedIn){
			appState.authToken = token;
			store.dispatch(setToken(token));
			localStorage["appState"] = JSON.stringify(appState);
			checkLoginStatus(function(data){
				if(!data){
					logout(true);
				}
			});
		}
	}
}

export function getUnreadMessageCount(getData) {
	request.get('messages/check-messages', null, function (payload, status, data) {
		store.dispatch(setUnreadMessageCount(payload ? payload.length : 0));
	});
}
