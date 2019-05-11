// Deps
import axios from 'axios';
import { pushMessage } from 'controllers/messenger'

export default {
	get: function(target, params = false, finalFunction = false){
		if(params === false){ params = {}; }
		axios.get(target, {params: prepareParams(params)})
		.then(res => {
			evaluateData(res, finalFunction);
		}).catch(error => {
			evaluateData({status: 500, error: error}, finalFunction)
		});
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

function evaluateData(res, finalFunction = false){
	switch(res.status){
		case 200:
			if(finalFunction){
				finalFunction(res.data.payload, res.status, res);
			}
		break;
		case 500:
			pushMessage(res.error.message, {type: "error"});
			if(finalFunction){
				finalFunction(false, res.status, res);
			}
		break;
		default:
			if(finalFunction){
				finalFunction(false, res.status, res);
			}
		break;

	}

	if(res.data.messages){
		for(let p = 0; p < res.data.messages.length; p++){
			pushMessage('', res.data.messages[p]);
		}
	}
}

function prepareParams(params) {
	return {
		token: "12345", /// Buralara backend marifet, efendime söyleyeyim redux çılgınlığı vesaire
		...params
	}
}

