// Deps
import axios from 'axios';

export default {
	get: function(target, params = false, finalFunction){
		if(params === false){ params = {}; }
		axios.get(target, {params: prepareParams(params)})
		.then(res => {
			switch(res.status){
				case 200:
					finalFunction(res.data.payload, res.status, res);
				break;
				default:
					finalFunction(false, res.status, res);
				break;
			}
		}).catch(error => {
			finalFunction(false, 500, error);
		});
	}
}

function prepareParams(params) {
	return {
		token: "12345", /// Buralara backend marifet, efendime söyleyeyim redux çılgınlığı vesaire
		...params
	}
}

