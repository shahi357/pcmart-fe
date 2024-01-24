import { StorageService } from "./storage.js";

const API_URL = "http://13.55.131.119:3005/api";
const LOGIN = API_URL + "/login";
const REGISTER = API_URL + "/register";
const PRODUCT_LIST = API_URL + "/products";
const PRODUCT_DETAIL = API_URL + "/products";
const ORDER = API_URL + "/orders";


const ORDER_LIST = API_URL + "/orders";
const ORDER_DETAIL = API_URL + "/orders";

const ADD_PRODUCT = API_URL + "/products";
const DELETE_PRODUCT = API_URL + "/products";
const UPDATE_PRODUCT = API_URL + "/products";

const USERS_LIST = API_URL + "/users";

export class ApiService {

    static login = async data => {

        try {
            let res = await fetch(LOGIN, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data)
            });

            let responseJson = await res.json();


            return {
                ...responseJson,
                status: res.status
            };

        } catch (e) {
            console.log(e);
        }

    }

    static register = async data => {
        try {
            const res = await fetch(REGISTER, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'POST',
                body: JSON.stringify(data),
                data: data
            });
            let responseJson = await res.json();

            return {
                ...responseJson,
                status: res.status
            };
        } catch (e) {
            console.log(e);
        }

    }


    static listProducts = async data => {
        try {
            const res = await fetch(PRODUCT_LIST + '?' + new URLSearchParams(data), {
                data: data
            });
            let responseJson = await res.json();
            return {
                ...responseJson,
                status: res.status
            };
        } catch (e) {
            console.log(e);
        }

    }

    static getProduct = async id => {
        try {
            const res = await fetch(PRODUCT_DETAIL + "/" + id);
            let responseJson = await res.json();
            return {
                ...responseJson,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }

    static sendOrder = async order => {
        try {
            const res = await fetch(ORDER, {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
                data: order,
                method: "POST"
            });

            let orderResponse = await res.json();
            return {
                ...orderResponse,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }


    static getAllOrders = async () => {
        try {
            let token = StorageService.getAuthToken();
            const res = await fetch(ORDER, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

            });

            let orderResponse = await res.json();
            return {
                ...orderResponse,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }

    static getOrderDetail = async (id) => {
        try {
            let token = StorageService.getAuthToken();
            const res = await fetch(ORDER_DETAIL +"/"+id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

            });

            let orderResponse = await res.json();
            return {
                ...orderResponse,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }

    static addProduct = async data => {
        try {
            let token = StorageService.getAuthToken();
            const res = await fetch(ADD_PRODUCT, {
                headers: {
                    // "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                method: "POST",
                body: data

            });

            let productResponse = await res.json();
            return {
                ...productResponse,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }


    static updateProduct = async (payload, id) => {
        try {
            let token = StorageService.getAuthToken();
            const res = await fetch(UPDATE_PRODUCT + "/"+id, {
                headers: {
                    // "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                method: "PUT",
                body: payload

            });

            let productResponse = await res.json();
            return {
                ...productResponse,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }


    static deleteProduct = async id => {
        try {
            let token = StorageService.getAuthToken();
            const res = await fetch(DELETE_PRODUCT + "/" + id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                method: "DELETE",

            });

            let productResponse = await res.json();
            return {
                ...productResponse,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }


    static listUsers = async () => {
        try {
            let token = StorageService.getAuthToken();
            const res = await fetch(USERS_LIST, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

            });

            let userResponse = await res.json();
            return {
                ...userResponse,
                status: res.status
            }
        } catch (e) {
            console.log(e);
        }
    }


}



