// Deps
import axios from 'axios';
import { pushMessage } from 'controllers/messenger'

export default {
	get: function(target, params = false, finalFunction = false){
		if(params === false){ params = {}; }

		let ajaxToken = axios.CancelToken;
		let ajaxController = ajaxToken.source();

		axios.get(target, {params: prepareParams(params), cancelToken: ajaxController.token})
		.then(res => {
			evaluateData(res, finalFunction);
		}).catch(error => {
			evaluateData({status: 500, error: error}, finalFunction)
		});

		return ajaxController;
	},
	post: function(target, params = false, finalFunction = false){
		if(params === false){ params = {}; }
		axios.post(target, {params: prepareParams(params)})
		.then(res => {
			evaluateData(res, finalFunction);
		}).catch(error => {
			evaluateData({status: 500, error: error}, finalFunction)
		});
	}
}

function evaluateData(response, finalFunction = false){
	switch(response.status){
		case 200:
			if(finalFunction){
				finalFunction(response.data.payload, response.status, response);
			}
		break;
		case 500:
			pushMessage(response.error.message, {type: "error"});
			if(finalFunction){
				finalFunction(false, response.status, response);
			}
		break;
		default:
			if(finalFunction){
				finalFunction(false, response.status, response);
			}
		break;

	}

	if(response.data.messages){
		for(let p = 0; p < response.data.messages.length; p++){
			pushMessage('', response.data.messages[p]);
		}
	}
}

function prepareParams(params) {
	return {
		token: "12345", /// Buralara backend marifet, efendime söyleyeyim redux çılgınlığı vesaire
		...params
	}
}

