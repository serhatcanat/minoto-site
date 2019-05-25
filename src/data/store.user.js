import store from "data/store";
import Cookies from 'js-cookie';
import request from 'controllers/request'

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
	/*else if (action.type === "CLOSE_MODAL") {
		return Object.assign({}, state, {
			modalData: false
		});
	}*/
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

export function checkLoginStatus(endFunction = false) {
	/*setTimeout(function() {
		if(endFunction){
			endFunction();
		}
	}, 500);*/

	let session = Cookies.get('minoto-session');

	//if(session){
		if(!store.getState().user.initialized){
			request.get('/dummy/data/login.json', { session: session }, function(payload){
				if(payload){
					store.dispatch(setUserData(payload));
					if(endFunction){
						endFunction(true);
					}
				}
				else{
					if(endFunction){
						endFunction(false);
					}
				}
			});
		}
	/*}
	else {
		endFunction(false);
	}*/

	return false;
}