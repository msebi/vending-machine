import { VuexModule, Module, Mutation, Action } from "vuex-class-modules"
import { modulesStore } from "./store"
import * as I from './types'
import api, { axiosApi } from '../api/backend-api'

@Module
class PersonsModule extends VuexModule {
    loginSuccess = false;
    loginError = false;
    logoutSuccess = false;
    logoutError = false;
    registerSuccess = false;
    registerError = false;
    userEmail = "";
    userPass = "";
    accessToken = "";
    productsInVendingMachine: I.Product[] = [];
    order: I.Order = {
        products: [],
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

    get isLoggedIn() {
        this.accessToken = this.accessToken || localStorage.accessToken
        return this.accessToken
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

    @Mutation
    login_success(payload: I.CredentialsLoginObject) {
        this.loginSuccess = true;
        this.accessToken = payload.accessToken;
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

    @Action
    async login(loginObject: I.CredentialsLoginObject) {
        return new Promise((resolve, reject) => {
            console.log("Accessing (log in) backend with user: " + loginObject.userEmail);

            const requestBody: I.UserLoginRequestBody = {
                userEmail: loginObject.userEmail,
                userPass: loginObject.userPass,
                grant_type: 'password'
            }

            // auth contains the client id and client secret
            const config = {
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
                            userEmail: "",
                            userPass: "",
                            accessToken: response.data.access_token
                        };

                        this.login_success(loginPayload);

                        // set token
                        console.log('Setting bearer token');
                        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                    }
                    resolve(response)
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
            console.log("Accessing (register) backend with user: '" + registerObject.userEmail);
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
export default new PersonsModule({ store: modulesStore, name: "vending-machine-store" })
