let domain = window.location.hostname

let endpoint = process.env.REACT_APP_API_ENDPOINT ? process.env.REACT_APP_API_ENDPOINT : false;

if (!endpoint) {
	switch (domain) {
		case 'localhost':
			endpoint = 'http://localhost:8000'
			//endpoint = 'https://minoto-api.thinkerfox.com'
			break;
		case 'minoto.thinkerfox.com':
			//endpoint = 'https://minoto-api.thinkerfox.com'
			endpoint = 'https://api.minoto.com'
			break;
		default:
			endpoint = 'https://api.minoto.com'
			break;
	}
}

export const apiBase = `${endpoint}/v1/shared/`

//export const storagePath = 'https://minoto.ams3.digitaloceanspaces.com/'
export const storagePath = 'https://res.cloudinary.com/minoto/image/upload/'
export const basePath = 'https://minoto.com'