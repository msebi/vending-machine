import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

const axiosApi = axios.create({
    baseURL: `/api`,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

interface User {
    id: number;
    email: string;
    password: string;
    role: string[];
}

// Snack to be added/bought to the vending machine
interface Product {
    id: number;
    productName: string;
    productPrice: number;
    productQty: number;
}

interface StatusMsg {
    msg: string,
    status: string
}

interface Deposit {
    "5": number,
    "10": number,
    "20": number,
    "50": number,
    "100": number
}

interface Order {
    products: Product[]
}

export default {
    // CRUD users
    createUser(user: User, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<StatusMsg>> {
        return axiosApi.post<StatusMsg>('/user/create/', user, requestConfig);
    },
    getUser(userId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<User>> {
        return axiosApi.get<User>(`/user/` + userId, requestConfig);
    },
    deleteUser(userId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<StatusMsg>> {
        return axiosApi.delete(`/user/del/` + userId, requestConfig);
    },
    // CRUD products
    createProduct(product: Product, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<StatusMsg>> {
        return axiosApi.post<StatusMsg>('/product/create/', product, requestConfig);
    },
    getProduct(productId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<Product>> {
        return axiosApi.get<Product>(`/product/` + productId, requestConfig);
    },
    refillProduct(product: Product, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<StatusMsg>> {
        return axiosApi.post<StatusMsg>('/product/refill/', product, requestConfig);
    },
    delProduct(productId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<StatusMsg>> {
        return axiosApi.post<StatusMsg>(`/product/del/` + productId, requestConfig);
    },
    // Purchases 
    deposit(deposit: Deposit, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<Deposit>> {
        return axiosApi.post<Deposit>('/deposit/', requestConfig);
    },
    buy(order: Order, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<Order>> {
        return axiosApi.post<Order>('/buy/', order, requestConfig);
    },
    reset(requestConfig: AxiosRequestConfig): Promise<AxiosResponse<StatusMsg>> {
        return axiosApi.get('/reset/', requestConfig);
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


