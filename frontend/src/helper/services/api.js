// import { API_ROUTES } from 'app/constant/api';
import axios from 'axios'
// import url from 'url'
import Storage from './storage';
import { API } from '../../config/API/api.config';


// const { BASE_URL, API_VERSION } = API_ROUTES;
export const API_BASE_URL = API.endpoint;
// const API_BASE_URL = url.format(BASE_URL + API_VERSION);

export const ApiGet = (url, params = {}, options = {}) => {
    params = params == null || params == undefined ? {} : params;
    
    return new Promise((resolve, reject) => {
        axios.get(`${API_BASE_URL}/${url}`, { params, ...getHttpMemberOptions(options, true) })
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    // Storage.deauthenticateUser();
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.message
                    });
                }
            });
    });
}

export const ApiPost = (url, fromData = {}, options = {}) => {
    fromData = fromData == null || fromData == undefined ? {} : fromData;
   // console.log(`${API_BASE_URL}/${url}`,"++++++++++",fromData)
    return new Promise((resolve, reject) => {
        axios.post(`${API_BASE_URL}/${url}`, fromData, getHttpMemberOptions(options, true))
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    // Storage.deauthenticateUser();
                    // todo : redirect to login page
                    
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.message
                    });
                }
            });
    });
}


export const ApiPut = (url, fromData = {}, options = {}) => {
    fromData = fromData == null || fromData == undefined ? {} : fromData;
    return new Promise((resolve, reject) => {
        axios.put(`${API_BASE_URL}/${url}`, fromData, getHttpMemberOptions(options, true))
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    // Storage.deauthenticateUser();
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.message
                    });
                }
            });
    });
}

export const ApiDelete = (url, data = {}, options = {}) => {
    data = data == null || data == undefined ? {} : data;
    return new Promise((resolve, reject) => {
        axios.delete(`${API_BASE_URL}/${url}`, { data, ...getHttpMemberOptions(options, true) })
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    // Storage.deauthenticateUser();
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.message
                    });
                }
            });
    });
}

export const ApiGetNoAuth = (url, params = {}, options = {}) => {
    params = params == null || params == undefined ? {} : params;
    return new Promise((resolve, reject) => {
        axios.get(`${API_BASE_URL}/${url}`, { params, ...getHttpMemberOptions(options) })
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    // Storage.deauthenticateUser();
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.message
                    });
                }
            });
    });
}

export const ApiPostNoAuth = (url, fromData, options = {}) => {
    fromData = fromData == null || fromData == undefined ? {} : fromData;
    return new Promise((resolve, reject) => {
        axios.post(`${API_BASE_URL}/${url}`, fromData, getHttpMemberOptions(options))
            .then((responseJson) => {
                resolve(responseJson.data);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    Storage.deauthenticateUser();
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.message
                    });
                }
            });
    });
}

const getHttpMemberOptions = (options, isAuth = false) => {
    let headers = {
        'x-auth-token': "",
        'Content-Type': "application/json",
    };
    if (isAuth) {
        headers['x-auth-token'] = Storage.getToken() ?? "";
    }
    if (options.hasOwnProperty('Content-Type')) {
        headers['Content-Type'] = options['Content-Type'] ?? "";
    }
    return { headers }
}