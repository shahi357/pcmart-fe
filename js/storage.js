export class StorageService {

    static setAuthUser = data => {
        localStorage.setItem("user", JSON.stringify(data));
    }

    static setToken = token => {
        localStorage.setItem("token", token);
    }

    static isLoggedIn = () => {
        return !!localStorage.getItem("user");
    }

    static logoutUser = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    static getAuthUser = () => {
        if(!this.isLoggedIn()){
            return false;
        }
        return JSON.parse(localStorage.getItem("user"))
    }

    static getAuthToken = () => {
        if(!this.isLoggedIn()){
            return false;
        }
        return localStorage.getItem("token");
    }

    static isAdminLoggedIn = () => {
        if(!this.isLoggedIn()){
            return false;
        }

        let user = JSON.parse(localStorage.getItem("user"));
        return user.isAdmin;
    }

    static getCart = () => {
        return JSON.parse(localStorage.getItem("cart"));
    }

    static getCartProducts = () => {
        let cart = JSON.parse(localStorage.getItem("cart"));

        if(cart?.items){
            return cart.items;
        }
        return [];
    }

    static setCartProducts = products => {
        localStorage.setItem("cart",JSON.stringify(products));
    }



};

