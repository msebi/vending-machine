import axios, { AxiosResponse } from 'axios'

const axiosApi = axios.create({
    baseURL: `/api`,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});


interface User {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
}
// Snack to be added/bought to the vending machine
interface Product {
    id: number;
    productName: string;
    productPrice: number;
    productQty: number;
}

interface Amount {
    id: number; // user id
    firstName: string,
    lastName: string,
    amountAvailable: number;
}

interface Purchase {
    amountSpent: number;
    products: Product[];
    change: number;
}

// TODO:
//      -- add confirmation messages for each call (failure/pass)
//      -- coin types are validated server-side; possible values for a coin: 
//          5, 10, 20, 50 and 100
//      -- add enums for user roles and coin types 
export default {
    // CRUD users
    createUser(firstName: string, lastName: string, role: string): Promise<AxiosResponse<User>> {
        return axiosApi.post(`/user/create/` + firstName + '/' + lastName + '/' + role);
    },
    getUser(userId: number, user: string, password: string): Promise<AxiosResponse<User>> {
        return axiosApi.get(`/user/` + userId, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    deleteUser(userId: number, user: string, password: string): Promise<AxiosResponse<number>> {
        return axiosApi.post(`/user/del/` + userId, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    // CRUD products
    createProduct(productName: string, productPrice: number, productQty: number, user: string, password: string): Promise<AxiosResponse<Product>> {
        return axiosApi.post(`/product/create/` + productName + '/' + productPrice + '/' + productQty, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    getProduct(productId: number, user: string, password: string): Promise<AxiosResponse<Product>> {
        return axiosApi.post(`/product/` + productId, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    refillProduct(productId: number, productQty: number, user: string, password: string): Promise<AxiosResponse<Product>> {
        return axiosApi.post(`/product/refill/` + productId + '/' + productQty, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    delProduct(productId: number, user: string, password: string): Promise<AxiosResponse<number>> {
        return axiosApi.post(`/product/del/` + productId, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    // Purchases 
    deposit(coin: number, user: string, password: string): Promise<AxiosResponse<Amount>> {
        return axiosApi.post(`/deposit/` + coin, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    buy(productId: number, productCount: number, user: string, password: string): Promise<AxiosResponse<Purchase>> {
        return axiosApi.post(`/buy/` + productId + '/' + productCount, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    reset(user: string, password: string): Promise<AxiosResponse<Amount>> {
        return axiosApi.post(`/reset/` + user + '/' + password, {
            auth: {
                username: user,
                password: password
            }
        });
    },
    getSecured(user: string, password: string): Promise<AxiosResponse<string>> {
        return axiosApi.get(`/secured/`, {
            auth: {
                username: user,
                password: password
            }
        });
    }
}


