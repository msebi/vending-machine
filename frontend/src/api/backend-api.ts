import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import * as I from './interfaces'

const axiosApi = axios.create({
    baseURL: `/api`,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});


export default {
    // login
    login(user: I.User, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
        return axiosApi.post<I.StatusMsg>('/user/login', user, requestConfig);
    },
    // CRUD users
    createUser(user: I.User, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
        return axiosApi.post<I.StatusMsg>('/user/create', user, requestConfig);
    },
    getUser(userId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.User>> {
        return axiosApi.get<I.User>(`/user/` + userId, requestConfig);
    },
    deleteUser(userId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
        return axiosApi.delete(`/user/del/` + userId, requestConfig);
    },
    // CRUD products
    createProduct(product: I.Product, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
        return axiosApi.post<I.StatusMsg>('/product/create', product, requestConfig);
    },
    getProduct(productId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.Product>> {
        return axiosApi.get<I.Product>(`/product/` + productId, requestConfig);
    },
    refillProduct(product: I.Product, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
        return axiosApi.post<I.StatusMsg>('/product/refill', product, requestConfig);
    },
    delProduct(productId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
        return axiosApi.post<I.StatusMsg>(`/product/del/` + productId, requestConfig);
    },
    // Purchases 
    deposit(deposit: I.Deposit, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.Deposit>> {
        return axiosApi.post<I.Deposit>('/deposit/', requestConfig);
    },
    buy(order: I.Order, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.Order>> {
        return axiosApi.post<I.Order>('/buy/', order, requestConfig);
    },
    reset(requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
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


