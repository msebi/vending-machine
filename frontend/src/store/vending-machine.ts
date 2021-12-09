import { VuexModule, Module, Mutation, Action } from "vuex-class-modules"
import { modulesStore } from "./store"
import * as I from './types'
import api, { axiosApi } from '../api/backend-api'
import { AxiosRequestConfig } from "axios";
import { textChangeRangeIsUnchanged } from "typescript";

@Module
class VendingMachineModule extends VuexModule {
    loginSuccess = false;
    loginError = false;
    loginErrorMsg = "";

    logoutSuccess = false;
    logoutError = false;
    logoutErrorMsg = "";

    registerSuccess = false;
    registerError = false;
    registerErrorMsg = "";

    buySuccess = false;
    // Buy needs to be interactive to the end user
    buySuccessMsg: I.StatusMsg = {
        msg: "",
        status: ""
    };
    buyError = false;
    buyNetworkError = false;
    buyErrorMsg: I.StatusMsg = {
        msg: "",
        status: ""
    };
    buyNetworkErrorMsg = "";

    userEmail = "";
    userPass = "";
    accessToken = "";
    userRoles: Array<string> = new Array<string>();
    productsInVendingMachine: Array<I.Product> = new Array<I.Product>();
    order: I.Order = {
        products: new Array<I.Product>(),
        deposit: {
            "5": 0,
            "10": 0,
            "20": 0,
            "50": 0,
            "100": 0
        }
    };
    processedOrder: I.ProcessedOrder = {
        products: new Array<I.Product>(),
        deposit: {
            "5": 0,
            "10": 0,
            "20": 0,
            "50": 0,
            "100": 0
        },
        statusMsg: {
            msg: "",
            status: ""
        }
    };

    get getIsLoggedIn(): boolean {
        console.log("isLoggedIn " + !this.accessToken && this.accessToken.length === 0);
        if (!this.accessToken && this.accessToken.length === 0) return false;
        return true;
    }

    get getAccessToken() {
        return this.accessToken || localStorage.accessToken;
    }

    get getHasLoginErrored() {
        return this.loginError;
    }

    get getIsRegistered() {
        return this.registerSuccess;
    }

    get getHasRegisterErrored() {
        return this.registerError;
    }

    get getuserEmail() {
        return this.userEmail;
    }

    get getUserPass() {
        return this.userPass;
    }

    get getProductsGetter() {
        return this.productsInVendingMachine;
    }

    get getBuyNetworkError() {
        return this.buyNetworkError;
    }

    get getBuyNetworkErrorMsg() {
        return this.buyNetworkErrorMsg;
    }

    @Mutation
    has_bought_errored(value: boolean) {
        this.buyError = value;
    }

    get getHasBoughtErrored() {
        return this.buyError;
    }

    @Mutation
    buy_error_msg(msg: I.StatusMsg) {
        this.buyErrorMsg = { ...msg };
    }

    get getBuyErrorMessage() {
        return this.buyErrorMsg;
    }

    @Mutation
    buy_success_msg(msg: I.StatusMsg) {
        this.buySuccessMsg = { ...msg };
    }

    get getBuySuccessMessage() {
        return this.buySuccessMsg;
    }

    get getProcessedOrder() {
        return this.processedOrder;
    }

    @Mutation
    clear_errors() {
        this.loginError = false;
        this.logoutError = false;
        this.registerError = false;
        this.buyError = false;
    }

    @Mutation
    login_success(payload: I.CredentialsLoginObject) {
        this.loginSuccess = true;
        this.loginError = false;
        this.buyError = false;
        this.accessToken = payload.accessToken;
        localStorage.accessToken = payload.accessToken;
    }

    @Mutation
    login_error(loginErrorMsg: string) {
        this.loginSuccess = false;
        this.loginError = true;
        this.buyError = false;
        this.loginErrorMsg = loginErrorMsg;
    }

    @Mutation
    logout_success() {
        this.accessToken = "";
        this.logoutSuccess = true;
        this.logoutError = false;
        delete localStorage.accessToken;
    }

    @Mutation
    set_user_roles(userRoles: Array<string>) {
        this.userRoles = Object.assign([], userRoles);
    }

    @Mutation
    logout_error(logoutErrorMsg: string) {
        this.logoutError = true;
        this.logoutSuccess = false;
        this.loginErrorMsg = logoutErrorMsg;
    }

    @Mutation
    register_success() {
        this.registerSuccess = true;
        this.registerError = false;
    }

    @Mutation
    register_error(registerErrorMsg: string) {
        this.registerError = true;
        this.registerSuccess = false;
        this.registerErrorMsg = registerErrorMsg;
    }

    @Mutation
    buy_success(buySuccessMsg: I.StatusMsg) {
        this.buySuccess = true;
        this.buySuccessMsg = { ...buySuccessMsg };
        this.buyError = false;
    }

    @Mutation
    buy_network_error(buyNetworkErrorMsg: string) {
        this.buyNetworkError = true;
        this.buyNetworkErrorMsg = buyNetworkErrorMsg;
        this.buyError = false;
        this.buySuccess = false;
    }

    @Mutation
    set_products(productsInVendingMachine: Array<I.Product>) {
        this.productsInVendingMachine = productsInVendingMachine;
    }

    @Mutation
    set_bought_products(order: I.ProcessedOrder) {
        this.processedOrder = { ...order };
    }

    @Action
    async login(loginObject: I.CredentialsLoginObject) {
        return new Promise((resolve, reject) => {
            console.log("Accessing log in backend with user: " + loginObject.username);

            const requestBody: I.UserLoginRequestBody = {
                username: loginObject.username,
                password: loginObject.password,
                grant_type: 'password'
            }

            // auth contains the client id and client secret
            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                auth: {
                    username: 'myApp',
                    password: 'pass'
                }
            }

            api.login(requestBody, config)
                .then(response => {
                    console.log("Response access token: '" + response.data.access_token + "' with Statuscode " + response.status);
                    if (response.status == 200) {
                        console.log("Login successful");

                        const loginPayload: I.CredentialsLoginObject = {
                            username: "",
                            password: "",
                            accessToken: response.data.access_token
                        };

                        this.login_success(loginPayload);

                        // set token
                        console.log('Setting bearer token');
                        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                    }
                })
                .then(() => {
                    api.getCurrentUserRoles().then(response => {
                        console.log("Response user roles: '" + response.data + "' with StatusCode " + response.status);
                        if (response.status == 200) {
                            console.log("Got current user roles");

                            this.set_user_roles(response.data);
                        }
                        resolve(response);
                    })
                        .catch(error => {
                            console.log("Error getting current user roles: " + error);
                        });
                })
                .catch(error => {
                    console.log("Error login: " + error);
                    this.login_error(error);
                    reject("Invalid credentials!")
                })
        })
    }

    @Action
    async logout() {
        return new Promise((resolve, reject) => {
            console.log("Accessing (log out)");

            api.logout().then(response => {
                console.log("Server response: " + response.data + " Statuscode: " + response.status);
                if (response.status == 200) {
                    axiosApi.defaults.headers.common['Authorization'] = undefined;
                    this.logout_success();
                }
                resolve(response);
            }).catch(error => {
                console.log("Error logout: " + error);
                // place the loginError state into our vuex store
                this.logout_error(error);
                reject(error);
            });
        });
    }

    @Action
    async register(registerObject: I.UserRegisterRequestBody) {
        return new Promise((resolve, reject) => {

            console.log("Accessing (register) backend with user: " + registerObject.email);
            api.register(registerObject)
                .then(response => {
                    console.log("Response: '" + response.data + "' with Statuscode " + response.status);
                    if (response.status == 200) {
                        console.log("Register successful");
                        // place the registerSuccess state into our vuex store
                        this.register_success()
                    }
                    resolve(response)
                })
                .catch(error => {
                    console.log("Error: " + error);
                    // place the registerError state into our vuex store
                    this.register_error(error);
                    reject("Failed to register!")
                })
        })
    }

    @Action
    async getProductsAction() {
        return new Promise((resolve, reject) => {
            console.log("Fetching products");
            api.getProducts()
                .then(response => {
                    console.log("Response: '" + response.data + "' with Statuscode " + response.status);
                    if (response.status == 200) {
                        console.log("Got products");
                        // place the registerSuccess state into our vuex store
                        this.set_products(response.data)
                    }
                    resolve(response)
                })
                .catch(error => {
                    console.log("Error: " + error);
                    // place the registerError state into our vuex store
                    this.register_error(error);
                    reject("Couldn't get products!");
                })
        })
    }

    @Action
    async buyProduct(order: I.Order) {
        return new Promise((resolve, reject) => {
            console.log("Processing order: ");
            api.buy(order)
                .then(response => {
                    console.log("Response: '" + response.data + "' with Statuscode " + response.status);
                    if (response.status == 201) {
                        console.log("Received purchase response; checking if purchase succeeded");
                        console.log("Response data: " + JSON.stringify(response.data));
                        if (response.data.statusMsg.status === "FAILED") {
                            console.log("Purchase failed");
                            this.has_bought_errored(true);
                            console.log("status msg: " + JSON.stringify(response.data.statusMsg));
                            this.buy_error_msg(response.data.statusMsg);
                            this.buy_success_msg({ msg: "", status: "" });
                            console.log("Purchase failed end if");
                        }
                        if (response.data.statusMsg.status === "SUCCESS") {
                            console.log("Purchase success");
                            this.has_bought_errored(false);
                            this.buy_error_msg({ msg: "", status: "" });
                            console.log("status msg: " + JSON.stringify(response.data.statusMsg));
                            this.buy_success_msg(response.data.statusMsg);
                            console.log("Purchase success end if");
                        }
                        // place the registerSuccess state into our vuex store
                        this.set_bought_products(response.data);
                    }
                    resolve(response);
                })
                .catch(error => {
                    console.log("Error: " + error);
                    // place the registerError state into our vuex store
                    this.buy_network_error(error);
                    reject("Couldn't buy product!")
                });
        });
    }

    @Action
    async getHelloMessage() {
        return new Promise((resolve, reject) => {
            console.log("Get hello");
            api.hello()
                .then(response => {
                    console.log("Response: '" + response.data + "' with Statuscode " + response.status);
                    if (response.status == 200) {
                        console.log("Got hello");
                    }
                    resolve(response)
                })
                .catch(error => {
                    console.log("Error: " + error);
                    // place the registerError state into our vuex store
                    this.register_error(error);
                    reject("Failed to ping server")
                })
        })
    }
}

// Register the module and Create a proxy to it
export default new VendingMachineModule({ store: modulesStore, name: "vending-machine-store" })
