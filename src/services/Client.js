import axios from "axios";
/*import {LocalStorageItem, LocalStorageService} from "./localStorageService";*/

export const CONTENT_TYPE = {
    APPLICATION_JSON: "application/json",
    MULTIPART_DATA: "multipart/form-data"
};

// const _localStorage = new LocalStorageService();
export const get = async (url, contentType = CONTENT_TYPE.APPLICATION_JSON) =>
    await axios({
        method: 'GET',
        url,
        headers: {
            'Content-Type': contentType,
            // 'Authorization': `Bearer ${_localStorage.get(LocalStorageItem.USER_ID)}`
        }
    })
        .then(data => data)
        .catch(error => error);

export const post = async (url, data, contentType = CONTENT_TYPE.APPLICATION_JSON) =>
    await axios({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': contentType,
            // 'Authorization': `Bearer ${_localStorage.get(LocalStorageItem.USER_ID)}`
        },
        data: contentType === CONTENT_TYPE.APPLICATION_JSON ? JSON.stringify(data) : data
    })
        .then(response => response)
        .catch(error => error);

export const put = async (url, data, contentType = CONTENT_TYPE.APPLICATION_JSON) =>
    await axios({
        method: 'PUT',
        url: url,
        headers: {
            'Content-Type': contentType,
            // 'Authorization': `Bearer ${_localStorage.get(LocalStorageItem.USER_ID)}`
        },
        data: contentType === CONTENT_TYPE.APPLICATION_JSON ? JSON.stringify(data) : data
    })
        .then(response => response)
        .catch(error => error);

export const del = async (url,data=null, contentType = CONTENT_TYPE.APPLICATION_JSON) =>
    await axios.delete(url, {
        headers: {
            'Content-Type': contentType,
            // 'Authorization': `Bearer ${_localStorage.get(LocalStorageItem.USER_ID)}`,
        },
        data: JSON.stringify(data),
    })
        .then(data => data)
        .catch(error => error);
