// import { STORAGE_KEY } from "app/constant/storage";

class Storage {
    static set(key, data) {
        localStorage.setItem(key, data);
    }

    static setJson(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static get(key) {
        return localStorage.getItem(key);
    }

    static getJson(key) {
        const data = localStorage.getItem(key);
        return JSON.parse(data);
    }

    static delete(key) {
        localStorage.removeItem(key);
    }

    // Others
    static getToken() {
        return localStorage.getItem("token");
    }
    


    // static isUserAuthenticated() {
    //     return (localStorage.getItem(STORAGE_KEY.token) !== null);
    // }

    // static deauthenticateUser() {
    //     localStorage.removeItem(STORAGE_KEY.token);
    //     localStorage.removeItem(STORAGE_KEY.user);
    // }

}

export default Storage;