const domain = (window.location.hostname === 'localhost' ? 'localhost:8000' : 'minoto-api.thinkerfox.com');

//const domain = 'minoto-api.thinkerfox.com';

export const apiBase = `http://${domain}/v1/shared/`
export const storagePath = 'https://minoto-test.ams3.digitaloceanspaces.com/'
export const basePath = 'https://minoto.com'