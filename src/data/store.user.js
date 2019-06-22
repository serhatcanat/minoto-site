import extend from 'lodash/extend'
import store from "data/store";
import request from 'controllers/request'
import { serializeArray } from 'functions/helpers'

const initialState = {
	token: false,
	user: false,
};

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
	return state;
};
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

export function checkLoginStatus(endFunction = false) {
	/*setTimeout(function() {
		if(endFunction){
			endFunction();
		}
	}, 500);*/

	if(localStorage["appState"]){
		let appState = JSON.parse(localStorage["appState"]);
		if(appState.isLoggedIn){
			store.dispatch(setUserData(appState.user));
			store.dispatch(setToken(appState.authToken));

			request.get('user/check', {}, function (payload) {
				if (payload && payload.isLoggedIn) {
					store.dispatch(setUserData(payload));
				}
			});
		}
	}

	/*
	let session = Cookies.get('minoto-session');

	if (session) {
		if (!store.getState().user.initialized) {
			request.get('/dummy/data/login.json', { session: session }, function (payload) {
				console.log(payload);
				if (payload) {
					store.dispatch(setUserData(payload));
					if (endFunction) {
						endFunction(true);
					}
				}
				else {
					if (endFunction) {
						endFunction(false);
					}
				}
			});
		}
	}
	else {
		return false;
	}
	*/

	return false;
}

export function login(form, finalFunction = false) {
	request.post('user/login', serializeArray(form), function(payload){
		console.log(payload);
		if(payload && payload.success){
			/*const { name, id, email, auth_token } = payload.data;

			let userData = {
				name,
				id,
				email,
				auth_token,
				timestamp: new Date().toString()
			};*/

			let userData = {
				username: "",
				avatar: "/dummy/images/profile-picture.jpg",
				name: "Kullanıcı",
				surname: "",
				fullname: "",
				email: "",
				location: "",
				phone: "",
				gender: "",
				birthyear: "",
				profileCompletion: 0
			}

			extend({}, userData, payload.userData)

			let appState = {
				isLoggedIn: true,
				user: userData,
				authToken: userData.auth_token,
			}

			localStorage["appState"] = JSON.stringify(appState);
			store.dispatch(setUserData(userData));
			if(finalFunction){
				finalFunction(extend({}, payload, {message: "Giriş Başarılı"}));
			}
		}
		else {
			logout();
			if(finalFunction){
				finalFunction(payload);
			}
		}
	});
}

export function logout() {
	localStorage["appState"] = JSON.stringify({isLoggedIn: false, user: false});

	store.dispatch(setUserData(false));
	store.dispatch(setToken(false));
}