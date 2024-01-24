import { ApiService } from "./apis.js";
import { StorageService } from "./storage.js";
import { Cart } from "./cart.js";

export class App {

    cart;

    static setup = () => {

        this.cart = new Cart();
        this.checkUser();

    }

    static setupEvents = () => {
        const event = document.createEvent("userLoggedIn");
        event.initEvent("userLoggedIn", true, true);

    }

    static checkUser = () => {
        let isLoggedIn = StorageService.isLoggedIn();
        if (isLoggedIn) {
            document.getElementById('userprofiledisplay').remove();
        } else {
            document.getElementById('logoutDisplay').remove();
        }
        return isLoggedIn;
    }

    static checkAdmin = () => {
        return StorageService.isAdminLoggedIn();
    }

    static loginUser = async data => {
        try {
            let loginResponse = await ApiService.login(data);

            if (loginResponse.status >= 300) {
                document.getElementById('errorMessage').innerText = loginResponse.data.message;
                return;
            }
            StorageService.setAuthUser(loginResponse.data.user);
            StorageService.setToken(loginResponse.data.token);


            if (loginResponse.data.user.isAdmin) {
                window.location.href = "/admin/admindash.html";
            } else {
                window.location.href = "/";
            }

        } catch (e) {
            console.log(e);
            document.getElementById('errorMessage').innerText = "Could not login currently, please try again later";
        }

    }

    static registerUser = async data => {
        try {
            let registerResponse = await ApiService.register(data);

            if (registerResponse.status >= 300) {
                document.getElementById('errorMessage').innerText = registerResponse.message;
                document.getElementById('errorMessage').scrollIntoView();
            }
            document.getElementById('successMessage').innerText = registerResponse.message;
            document.getElementById('successMessage').scrollIntoView();
            return registerResponse;


        } catch (e) {
            console.log(e);
        }
    }

    static logoutUser = () => {
        try {
            StorageService.logoutUser();
            window.location.href = "/login.html";
        } catch (e) {
            console.log(e);
            alert("Could not logout currently");
        }
    }

    static getProducts = async (data, requireHtml = true) => {
        try {
            let products = await ApiService.listProducts(data);
            if (!requireHtml)
                return products;

            let html = "";

            if (products.data.length) {
                products.data.forEach(product => {
                    let productHtml = `<div class="col-lg-3 col-sm-6">
                <div class="product-item">
                <div class="pi-pic">
                <a class="d-block" href="product.html?id=${product._id}">
                <img src=" ${product.imageUri} " alt=""></a>
                <div class="pi-links">
                <a href="" class="addToCart" data-product='${JSON.stringify(product)}' class="add-card"><i class="flaticon-bag"></i><span></span></a>
                </div>
                </div>
                <div class="pi-text">
                <h6>$${product.productPrice}</h6>
                <p>${product.productName}</p>
                </div>
                </div></div>`;
                    html += productHtml;
                });
            } else {
                html += '<h3 class="text-center text-danger col-12">No products found</h3>';
            }

            return html;
        } catch (e) {
            console.log(e);
            return '<div class="text-center text-danger">Could not fetch products currently</div>';
        }
    }

    static getProduct = async (id,requireHtml = true) => {
        try {
            let productRes = await ApiService.getProduct(id);

            if(!requireHtml)
                return productRes;

            let product = productRes.data;
            let html = `
            <div class="row">
            <div class="col-lg-6">
                <div class="product-pic-zoom" style="width: 400px; height: 400px;" id="mainproductdisplay">

                    <img src="${product.imageUri}" id="abcde" />
                </div>
                <div class="product-thumbs" tabindex="1" style="overflow: hidden; outline: none;">
                    <div class="product-thumbs-track" id="auxImageDisplay">

                        <div class="pt" data-imgbigurl=""><img src="${product.imageUri}" alt="" id="alt1"></div>
                        <div class="pt" data-imgbigurl=""><img src="${product.imageUri}" alt="" id="alt2"></div>

                    </div>
                </div>
            </div>
            <div class="col-lg-6 product-details">
                <h2 class="p-title" id="productname">
                    ${product.productName}
                </h2>
                <h3 class="p-price" id="productprice">

                    $${product.productPrice}
                </h3>
                <h4 class="p-stock">Available: <span>In Stock</span></h4>
                
                

                <div class="quantity">
                    <p>Quantity</p>
                    <div class="pro-qty"><input type="text" maxlength="2" value="1" id="pro_quantity"></div>
                </div>

               
                <a href="" class="addToCart" data-product='${JSON.stringify(product)}' class="site-btn bg-primary">ADD TO CART</a>

                <div id="accordion" class="accordion-area">
                    <div class="panel">
                        <div class="panel-header" id="headingOne">
                            <button class="panel-link active" data-toggle="collapse" data-target="#collapse1"
                                aria-expanded="true" aria-controls="collapse1">information</button>
                        </div>
                        <div id="collapse1" class="collapse show" aria-labelledby="headingOne"
                            data-parent="#accordion">
                            <div class="panel-body" id="productDescription">
                                ${product.productDescription}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
            `;
            return html;
        } catch (e) {
            console.log(e);
        }
    }

    static addToCart = (product, qty = 1) => {
        this.cart.addItem(product, qty);

    }

    static getCartProducts = () => {
        return this.cart.items;
    }

    static sendOrder = async order => {
        try {
            let orderResponse = await ApiService.sendOrder(order);
            return orderResponse;
        } catch (e) {
            console.log(e);
        }
    }

    static getAllOrders = async () => {
        try {
            let orderResponse = await ApiService.getAllOrders();
            let html = '';
            console.log(orderResponse);
            orderResponse.data.forEach((order, index) => {
                let orderHtml = `
                <tr>
                <td>${index + 1}</td>
                <td>${order._id}</td>
                <td>${order.orderDetails.length}</td>
                <td>${order.total}</td>
                <td>${order.orderDate}</td>
                <td>${order.userName}</td>
               
                <td><a id="delivery" href=""><span class="badge-dot badge-brand mr-1"></span><a href="/admin/orderdetails.html?id=${order._id}" class="text-primary">View</h6></a></td>
                </tr>
                `;

                html += orderHtml;
            })
            return html;
        } catch (e) {
            console.log(e);
        }
    }

    static getOrderDetail = async (id) => {
        try {
            let orderResponse = await ApiService.getOrderDetail(id);
            console.log(orderResponse);
            let order = orderResponse.data;
            let productListHtml = this.generateProductsTable(order.orderDetails)
            let html = `
            <div class="card">
            <h5 class="card-header">Order Id:  ${order._id} <span class="float-right">${order.orderDate}</span></h5>
            <div class="row mx-2">
                <div class="col-4">
                    <h5  class="my-1 py-1">Name : ${order.userName}</h5>
                    <h5 class="my-1 py-1">Email : ${order.userEmail}</h5>
                    <h5 class="my-1 py-1">Phone :  ${order.userPhone}</h5>
                </div>
                
                <div class="col-4">
                    <h5  class="my-1 py-1">City :  ${order.city}</h5>
                    <h5 class="my-1 py-1">Postal :  ${order.postal}</h5>
                    <h5 class="my-1 py-1">Address1 :  ${order.userAddress1}</h5>
                    <h5 class="my-1 py-1">Address2 :  ${order.userAddress2}</h5>
                </div>

                <div class="col-4">
                    <h5  class="my-1 py-1">Qty : ${order.orderDetails.length}</h5>
                    <h5  class="my-1 py-1">Total : ${order.total}</h5>
                </div>
            </div>
            
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table">
                        <thead class="bg-light">
                            <tr class="border-0">
                                <th class="border-0">S/N</th>
                                <th class="border-0">Image</th>
                                <th class="border-0">Name</th>
                                <th class="border-0">Qty</th>
                                <th class="border-0">Price</th>
                                <th class="border-0">Total</th>
                            
                            </tr>
                        </thead>
                        <tbody id="displayRecentOrder">
                            ${productListHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
            `;
           


           
            return html;
        } catch (e) {
            console.log(e);
        }
    }

    static generateProductsTable = products => {
        let html = '';

        products.forEach((product,index)=>{
            let productHtml = `
            <tr class="border-0">
            <th class="border-0">${index + 1}</th>
            <th class="border-0"> <img src="${product.product.imageUri}" width="50" height="50"></th>
            <th class="border-0">${product.product.productName}</th>
            <th class="border-0">${product.quantity}</th>
            <th class="border-0">${product.price}</th>
            <th class="border-0">${product.price * product.quantity}</th>
        
        </tr>
            `;

            html += productHtml;
        })

        return html;
    }

    static addProduct = async payload => {
        try {
            let productResponse = await ApiService.addProduct(payload);
            return productResponse;

        } catch (e) {
            console.log(e);
        }
    }

    static updateProduct = async (payload,id) => {
        try {
            let productResponse = await ApiService.updateProduct(payload,id);
            return productResponse;

        } catch (e) {
            console.log(e);
        }
    }

    static deleteProduct = async payload => {
        try {
            let productResponse = await ApiService.deleteProduct(payload);
            return productResponse;

        } catch (e) {
            console.log(e);
        }
    }


    static getAllUsers = async () => {
        try {
            let userResponse = await ApiService.listUsers();
            let html = '';
           
            userResponse.data.forEach((user, index) => {
                let userHtml = `
                <tr>
                <td>${index + 1}</td>
                <td>${user._id}</td>
                <td>${user.userName}</td>
                <td>${user.userEmail}</td>
                <td>${user.userPhone}</td>
                <td>${user.city}</td>
                <td>${user.postal}</td>
               
                 </tr>
                `;

                html += userHtml;
            })
            return html;
        } catch (e) {
            console.log(e);
        }
    }
}





