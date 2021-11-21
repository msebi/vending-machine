import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as I from '../store/types';
import querystring from "querystring";
import { CredentialsObject } from '../store/types';

export const axiosApi = axios.create({
    baseURL: `/api`,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});


export default {
    // login/out
    login(userDetails: CredentialsObject, requestConfig: AxiosRequestConfig): Promise<AxiosResponse> {
        console.log('login requestBody: ' + querystring.stringify(userDetails));
        return axiosApi.post('/oauth/token', querystring.stringify(userDetails), requestConfig);
    },
    logout(): Promise<AxiosResponse<I.StatusMsg>> {
        console.log('logout');
        // clear deposit if any
        return axiosApi.post('/user/logout');
    },
    // CRUD users
    register(requestBody: any, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.StatusMsg>> {
        console.log('login requestBody: ' + querystring.stringify(requestBody));
        return axiosApi.post<I.StatusMsg>('/user/create', querystring.stringify(requestBody), requestConfig);
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


