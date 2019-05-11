import store from "data/store";
import axios from 'axios';
import Cookies from 'js-cookie';

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
			axios.get('/dummy/data/login.json', {
				params: {
					session: session
				}
			})
			.then(res => {
				if(res.data.status === 'ok'){
					if(res.data.user && res.data.user !== false){
						store.dispatch(setUserData(res.data.user));
						if(endFunction){
							endFunction(true);
						}
					}
					else{
						if(endFunction){
							endFunction(false);
						}
					}
				}
				else{
					if(endFunction){
						endFunction(false);
					}
				}

			}).then(() => {
				//store.dispatch(setUserInitialized(true));
			});
		}
	/*}
	else {
		endFunction(false);
	}*/

	return false;
}