import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import * as I from '../store/types';
import querystring from "querystring";

export const axiosApi = axios.create({
    baseURL: `/api`,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});


export default {
    hello(): Promise<AxiosResponse> {
        return axiosApi.get('/hello');
    },
    login(userDetails: I.UserLoginRequestBody, requestConfig: AxiosRequestConfig): Promise<AxiosResponse> {
        // TODO: remove consoles
        console.log('login requestBody: ' + querystring.stringify({ ...userDetails }));
        console.log('login requestConfig: ' + JSON.stringify(requestConfig));
        return axiosApi.post('/oauth/token', querystring.stringify({ ...userDetails }), requestConfig);
    },
    logout(): Promise<AxiosResponse<I.StatusMsg>> {
        console.log('logout');
        // clear deposit if any
        return axiosApi.post('/logout');
    },
    // CRUD users
    // TODO: make sure the backend does not accept users with admin roles 
    register(requestBody: I.UserRegisterRequestBody): Promise<AxiosResponse<I.StatusMsg>> {
        console.log('register requestBody: ' + JSON.stringify({ ...requestBody }));
        return axiosApi.post<I.StatusMsg>('/user/create', requestBody);
    },
    getUser(userId: number, requestConfig: AxiosRequestConfig): Promise<AxiosResponse<I.User>> {
        return axiosApi.get<I.User>(`/user/` + userId, requestConfig);
    },
    getCurrentUserRoles(): Promise<AxiosResponse<Array<string>>> {
        return axiosApi.get<Array<string>>(`/user/get-current-user-roles`);
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
    getProducts(): Promise<AxiosResponse<I.Product[]>> {
        return axiosApi.get<I.Product[]>('/product/list-products');
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
    buy(order: I.Order): Promise<AxiosResponse<I.ProcessedOrder>> {
        return axiosApi.post<I.ProcessedOrder>('/product/buy/', order);
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


