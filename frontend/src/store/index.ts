// import api, { axiosApi } from '../api/backend-api'
// import * as I from './types'
// import { createStore } from 'vuex'

// const enhanceAccessToken = () => {
//     const { accessToken } = localStorage;
//     if (!accessToken) {
//         return;
//     }

//     axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
// };

// enhanceAccessToken();

// interface State {
//     loginSuccess: boolean;
//     loginError: boolean;
//     logoutSuccess: boolean;
//     logoutError: boolean;
//     registerSuccess: boolean;
//     registerError: boolean;
//     userEmail: string;
//     userPass: string;
//     accessToken: string;
//     productsInVendingMachine: Array<I.Product>;
//     order: I.Order;
// }

// export const store = createStore<State>({
//     state: {
//         loginSuccess: false,
//         loginError: false,
//         logoutSuccess: false,
//         logoutError: false,
//         registerSuccess: false,
//         registerError: false,
//         userEmail: "",
//         userPass: "",
//         accessToken: "",
//         productsInVendingMachine: Array<I.Product>(),
//         order: {
//             products: Array<I.Product>(),
//             deposit: {
//                 "5": 0,
//                 "10": 0,
//                 "20": 0,
//                 "50": 0,
//                 "100": 0
//             },
//             statusMsg: {
//                 msg: "",
//                 status: ""
//             }
//         }
//     },
//     mutations: {
//         login_success(state, payload) {
//             state.loginSuccess = true;
//             state.userEmail = payload.userEmail;
//             state.userPass = payload.userPass;
//             state.accessToken = payload.accessToken;
//         },
//         login_error(state, payload) {
//             state.loginError = true;
//             state.userEmail = payload.userEmail;
//         },
//         logout_success(state) {
//             state.accessToken = "";
//             state.logoutSuccess = true;
//             delete localStorage.accessToken;
//         },
//         logout_error(state) {
//             state.logoutSuccess = false;
//         },
//         register_success(state, payload) {
//             state.registerSuccess = true;
//             state.userEmail = payload.userEmail;
//             state.userPass = payload.userPass;
//         },
//         register_error(state, payload) {
//             state.registerError = true;
//             state.userEmail = payload.userEmail;
//         },
//     },
//     actions: {
//         login({ commit }, { userEmail, password }) {
//             return new Promise((resolve, reject) => {
//                 console.log("Accessing (log in) backend with user: " + userEmail);

//                 const requestBody: I.UserLoginRequestBody = {
//                     username: userEmail,
//                     password: password,
//                     grant_type: 'password'
//                 }

//                 // auth contains the client id and client secret
//                 const config = {
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded'
//                     },
//                     auth: {
//                         username: 'myApp',
//                         password: 'pass'
//                     }
//                 }

//                 api.login(requestBody, config)
//                     .then(response => {
//                         console.log("Response access token: '" + response.data.access_token + "' with Statuscode " + response.status);
//                         if (response.status == 200) {
//                             console.log("Login successful");
//                             // place the loginSuccess state into our vuex store
//                             commit('login_success', {
//                                 userEmail: userEmail,
//                                 userPass: password,
//                                 accessToken: response.data.access_token
//                             });
//                             // set token
//                             console.log('Setting bearer token');
//                             axiosApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
//                         }
//                         resolve(response)
//                     })
//                     .catch(error => {
//                         console.log("Error login: " + error);
//                         // place the loginError state into our vuex store
//                         commit('login_error', {
//                             userEmail: userEmail
//                         });
//                         reject("Invalid credentials!")
//                     })
//             })
//         },
//         logout({ commit }) {
//             return new Promise((resolve, reject) => {
//                 console.log("Accessing (log out)");

//                 api.logout().then(response => {
//                     console.log("Server response: " + response.data + " Statuscode: " + response.status);
//                     if (response.status == 200) {
//                         axiosApi.defaults.headers.common['Authorization'] = undefined;
//                         commit('logout_success');
//                     }
//                     resolve(response);
//                 }).catch(error => {
//                     console.log("Error logout: " + error);
//                     // place the loginError state into our vuex store
//                     commit('logout_error');
//                     reject(error);
//                 });
//             });
//         },
//         register({ commit }, { userEmail, password }) {
//             return new Promise((resolve, reject) => {
//                 console.log("Accessing (register) backend with user: '" + userEmail);
//                 api.register(userEmail, password)
//                     .then(response => {
//                         console.log("Response: '" + response.data + "' with Statuscode " + response.status);
//                         if (response.status == 200) {
//                             console.log("Register successful");
//                             // place the registerSuccess state into our vuex store
//                             commit('register_success', {
//                                 userEmail: userEmail,
//                                 userPass: password
//                             });
//                         }
//                         resolve(response)
//                     })
//                     .catch(error => {
//                         console.log("Error: " + error);
//                         // place the registerError state into our vuex store
//                         commit('register_error', {
//                             userEmail: userEmail
//                         });
//                         reject("Failed to register!")
//                     })
//             })
//         },
//     },
//     getters: {
//         isLoggedIn: state => {
//             state.accessToken = state.accessToken || localStorage.accessToken
//             return state.accessToken
//         },
//         hasLoginErrored: state => state.loginError,
//         isRegistered: state => state.registerSuccess,
//         hasRegisterErrored: state => state.registerError,
//         getuserEmail: state => state.userEmail,
//         getUserPass: state => state.userPass,
//     }
// });
