import store from "data/store";
import axios from 'axios';

const initialState = {
	reservationInfo: false,
};

function checkoutReducer(state = initialState, action) {
	if (action.type === "SET_RESERVATION_INFO") {
		return Object.assign({}, state, {
			reservationInfo: action.payload
		});
	}
	return state;
};
export default checkoutReducer;

// Actions
function setReservationInfo(data) {
	return {
		type: 'SET_RESERVATION_INFO',
		payload: data
	};
}

export function checkReservationInfo(endFunction = false) {
	axios.get('/dummy/data/reservation.json').then(res => {
		if(res.data.status === 'ok'){
			store.dispatch(setReservationInfo(res.data.info));
		}

		if(endFunction){ endFunction(res.data.status === 'ok'); }
	});

	return false;
}

export function makeReservation(id, endFunction = false) {
	axios.get(
		'/dummy/data/reservation.json',
		{ params: { id: id } }
	).then(res => {
		if(res.data.status === 'ok'){
			store.dispatch(setReservationInfo(res.data.info));
		}

		if(endFunction){ endFunction(res.data.status === 'ok'); }
	});
}