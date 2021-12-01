import { VuexModule, Module, Mutation, Action } from "vuex-class-modules"
import { modulesStore } from "./store"
import * as I from './types'
import api, { axiosApi } from '../api/backend-api'
import { AxiosRequestConfig } from "axios";

@Module
class VendingMachineModule extends VuexModule {
    loginSuccess = false;
    loginError = false;
    logoutSuccess = false;
    logoutError = false;
    registerSuccess = false;
    registerError = false;
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
        },
        statusMsg: {
            msg: "",
            status: ""
        }
    };

    get isLoggedIn(): boolean {
        console.log("isLoggedIn " + !this.accessToken && this.accessToken.length === 0);
        if (!this.accessToken && this.accessToken.length === 0) return false;
        return true;
    }

    get getAccessToken() {
        return this.accessToken || localStorage.accessToken;
    }

    get hasLoginErrored() {
        return this.loginError;
    }

    get isRegistered() {
        return this.registerSuccess;
    }

    get hasRegisterErrored() {
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

    @Mutation
    clear_errors() {
        this.loginError = false;
        this.logoutError = false;
        this.registerError = false;
    }

    @Mutation
    login_success(payload: I.CredentialsLoginObject) {
        this.loginSuccess = true;
        this.accessToken = payload.accessToken;
        localStorage.accessToken = payload.accessToken;
    }

    @Mutation
    login_error() {
        this.loginError = true;
    }

    @Mutation
    logout_success() {
        this.accessToken = "";
        this.logoutSuccess = true;
        delete localStorage.accessToken;
    }

    @Mutation
    set_user_roles(userRoles: Array<string>) {
        this.userRoles = Object.assign([], userRoles);
    }

    @Mutation
    logout_error() {
        this.logoutSuccess = false;
    }

    @Mutation
    register_success() {
        this.registerSuccess = true;
    }

    @Mutation
    register_error() {
        this.registerError = true;
    }

    @Mutation
    set_products(productsInVendingMachine: I.Product[]) {
        this.productsInVendingMachine = productsInVendingMachine;
    }

    @Action
    async login(loginObject: I.CredentialsLoginObject) {
        return new Promise((resolve, reject) => {
            console.log("Accessing (log in) backend with user: " + loginObject.username);

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
                    this.login_error();
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
                this.logout_error();
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
                    this.register_error();
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
                    this.register_error();
                    reject("Couldn't get products!")
                })
        })
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
                    this.register_error();
                    reject("Failed to ping server")
                })
        })
    }

    // persons: PersonMapping = {}

    // @Mutation
    // setPersons(persons: Person[]) {
    //     this.persons = _keyBy(persons, 'id')
    // }

    // get personFullName() {
    //     return (id: string) => {
    //         const { name, lastName } = this.persons[id]
    //         return `${name} ${lastName}`
    //     }
    // }

    // @Action
    // async getPersons() {
    //     await new Promise(resolve => setTimeout(resolve, 500))
    //     this.setPersons(persons)
    // }
}

// Register the module and Create a proxy to it
export default new VendingMachineModule({ store: modulesStore, name: "vending-machine-store" })
