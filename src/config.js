let domain = window.location.hostname

let endpoint = process.env.REACT_APP_API_ENDPOINT ? process.env.REACT_APP_API_ENDPOINT : false;

if(!endpoint){
	switch (domain) {
	    case 'localhost':
	        endpoint = 'http://localhost:8000'
	        break;
	    case 'minoto.thinkerfox.com':
	        endpoint = 'http://minoto-api.thinkerfox.com'
	        break;
	    default:
	        endpoint = 'https://api.minoto.com'
	        break;
	}
}

export const apiBase = `${endpoint}/v1/shared/`

export const storagePath = 'https://minoto-test.ams3.digitaloceanspaces.com/'
export const basePath = 'https://minoto.com'