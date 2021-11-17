import { RootState } from './root-state'
import { VendingMachineState } from './types';
import { ActionTree } from 'vuex';
import * as I from './types'
import api, { axiosApi } from '../api/backend-api'


export const actions: ActionTree<VendingMachineState, RootState> = {
    login({ commit }, { userEmail, password }) {
        return new Promise((resolve, reject) => {
            console.log("Accessing (log in) backend with user: " + userEmail);

            const requestBody: I.UserLoginRequestBody = {
                username: userEmail,
                password: password,
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
                        // place the loginSuccess state into our vuex store
                        commit('login_success', {
                            userEmail: userEmail,
                            userPass: password,
                            accessToken: response.data.access_token
                        });
                        // set token
                        console.log('Setting bearer token');
                        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                    }
                    resolve(response)
                })
                .catch(error => {
                    console.log("Error login: " + error);
                    // place the loginError state into our vuex store
                    commit('login_error', {
                        userEmail: userEmail
                    });
                    reject("Invalid credentials!")
                })
        })
    },
    logout({ commit }) {
        return new Promise((resolve, reject) => {
            console.log("Accessing (log out)");

            api.logout().then(response => {
                console.log("Server response: " + response.data + " Statuscode: " + response.status);
                if (response.status == 200) {
                    axiosApi.defaults.headers.common['Authorization'] = undefined;
                    commit('logout_success');
                }
                resolve(response);
            }).catch(error => {
                console.log("Error logout: " + error);
                // place the loginError state into our vuex store
                commit('logout_error');
                reject(error);
            });
        });
    },
    register({ commit }, { userEmail, password }) {
        return new Promise((resolve, reject) => {
            console.log("Accessing (register) backend with user: '" + userEmail);
            api.register(userEmail, password)
                .then(response => {
                    console.log("Response: '" + response.data + "' with Statuscode " + response.status);
                    if (response.status == 200) {
                        console.log("Register successful");
                        // place the registerSuccess state into our vuex store
                        commit('register_success', {
                            userEmail: userEmail,
                            userPass: password
                        });
                    }
                    resolve(response)
                })
                .catch(error => {
                    console.log("Error: " + error);
                    // place the registerError state into our vuex store
                    commit('register_error', {
                        userEmail: userEmail
                    });
                    reject("Failed to register!")
                })
        })
    }
};