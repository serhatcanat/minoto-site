// Deps
import axios from 'axios';
import { pushMessage } from 'controllers/messenger'
import extend from 'lodash/extend'
import { apiPath } from 'functions/helpers'

const defaultConfig = {
	excludeApiPath: false,
};

export default {
	get: function(target, params = false, finalFunction = false, opts = {}){
		if(params === false){ params = {}; }

		let config = {};
		extend(config, defaultConfig, opts);

		let ajaxToken = axios.CancelToken;
		let ajaxController = ajaxToken.source();

		if(!config.excludeApiPath){
			target = apiPath(target);
		}

		axios.get(target, {params: prepareParams(params), cancelToken: ajaxController.token})
		.then(res => {
			evaluateData(res, finalFunction);
		}).catch(error => {
			evaluateData({status: 500, error: error, data: {}}, finalFunction)
		});

		return ajaxController;
	},
	post: function(target, params = false, finalFunction = false, opts = {}){
		if(params === false){ params = {}; }
		let config = {};
		extend(config, defaultConfig, opts);

		if(!config.excludeApiPath){
			target = apiPath(target);
		}

		axios.post(target, prepareParams(params))
		.then(res => {
			evaluateData(res, finalFunction);
		}).catch(error => {
			evaluateData({status: 500, error: error, data: {}}, finalFunction)
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
			pushMessage("HATA: İşlem gerçekleştirilemedi.", {type: "error"});
			console.log(response.error);
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
	let newParams = {
		token: "12345", /// Buralara backend marifet, efendime söyleyeyim redux çılgınlığı vesaire
		...params
	}
	return newParams;
}

