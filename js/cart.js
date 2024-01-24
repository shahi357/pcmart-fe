import { StorageService } from "./storage.js";
export class Cart {
    items = [];
    totalItems = 0;
    totalCost = 0.0;

    constructor() {
        this.init();
    }

    init = () => {
        this.items = StorageService.getCartProducts();

        this.totalItems = this.items ? this.items?.reduce((sum,item) => {
            return sum + item.count;
        },0) : 0;

        this.totalCost = this.items.length ? this.items?.reduce((sum,item) => {
            return sum +( item.productPrice * item.count);
        },0) : 0;
    }


    addItem = (item, quantity = 1) => {
        console.log("item to add",item);
        let targetItem = this.items ? this.items.filter(currItem => currItem.id === item.id)[0] : null;

        if (targetItem) targetItem.count += quantity;

        else this.items = [...this.items, { ...item, count: quantity }];

        this.totalItems += quantity;
        console.log("total cost",this.totalCost);
        this.totalCost += parseFloat((item.productPrice * quantity));
        this.commitCart();
    };

    removeItem = (item, all = false) => {
        let targetItem = this.items.filter(currItem => currItem.id === item.id)[0];

        if (targetItem.count === 1 || all) this.items = this.items.filter(currItem => currItem.id !== item.id);
        else targetItem.count -= 1;
        this.totalItems -= all ? targetItem.count : 1;
        this.totalCost -= all ? targetItem.count * item.productPrice : item.productPrice;
        this.commitCart();
    };

    getProductCartQuantity = (id) => {
        let targetItem = items.filter(currItem => currItem.id === id)[0];

        if (targetItem) return targetItem.count;

        return 1;

    }

    resetCart = () => {
        this.items = [];
        this.totalItems = 0;
        this.totalCost = 0;
        this.commitCart();
    };

    commitCart = () => {
        let cart = {
            items: this.items,
            totalItems: this.totalItems,
            totalCost: this.totalCost
        }
        let event = new Event("cartUpdated");
        document.dispatchEvent(event);
        StorageService.setCartProducts(cart);
    }

}
