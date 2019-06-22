import extend from 'lodash/extend'
import store from "data/store"
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

export function checkLoginStatus(endFunction = false) {

	if(localStorage["appState"]){
		let appState = JSON.parse(localStorage["appState"]);
		if(appState.isLoggedIn){
			store.dispatch(setUserData(appState.user));
			store.dispatch(setToken(appState.authToken));

			request.get('users/'+appState.user.email, {}, function (payload) {
				if (payload && payload.success) {
					updateUserData(payload);

					if(endFunction){
						endFunction(true);
					}
				}
				else{
					logout();
					if(endFunction){
						endFunction(false);
					}
				}
			});
		}
		else {
			if(endFunction){
				endFunction(false);
			}
		}
	}
	else {
		if(endFunction){
			endFunction(false);
		}
	}

	return false;
}

export function login(form, finalFunction = false) {
	request.post('user/login', serializeArray(form), function(payload){
		if(payload && payload.success){
			updateUserData(payload);

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
	})
}

export function register(form, finalFunction = false) {
	request.post('user/register', serializeArray(form), function(payload){
		if(payload && payload.success){
			updateUserData(payload);

			if(finalFunction){
				finalFunction(extend({}, payload, {message: "Giriş Başarılı"}));
			}
		}
		else {
			/*logout();
			if(finalFunction){
				finalFunction(payload);
			}*/
		}
	})
}

function updateUserData(payload){
	let userData = extend({}, {
		username: "",
		avatar: "/dummy/images/profile-picture.jpg",
		name: "Kullanıcı",
		surname: "",
		fullname: "",
		email: "",
		location: false,
		phone: "",
		gender: "",
		birthyear: "",
		profileCompletion: 0
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

export function logout() {
	localStorage["appState"] = JSON.stringify({isLoggedIn: false, user: false, authToken: false});

	store.dispatch(setUserData(false));
	store.dispatch(setToken(false));
}