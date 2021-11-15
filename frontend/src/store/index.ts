import { createStore } from 'vuex'
import api from '../api/backend-api'

export default createStore({
    state: {
        loginSuccess: false,
        loginError: false,
        registerSuccess: false,
        registerError: false,
        userEmail: null,
        userPass: null
    },
    mutations: {
        login_success(state, payload) {
            state.loginSuccess = true;
            state.userEmail = payload.userEmail;
            state.userPass = payload.userPass;
        },
        login_error(state, payload) {
            state.loginError = true;
            state.userEmail = payload.userEmail;
        },
        register_success(state, payload) {
            state.registerSuccess = true;
            state.userEmail = payload.userEmail;
            state.userPass = payload.userPass;
        },
        register_error(state, payload) {
            state.registerError = true;
            state.userEmail = payload.userEmail;
        },
    },
    actions: {
        login({ commit }, { userEmail, password }) {
            return new Promise((resolve, reject) => {
                console.log("Accessing (log in) backend with user: '" + userEmail);
                api.login(userEmail, password)
                    .then(response => {
                        console.log("Response: '" + response.data + "' with Statuscode " + response.status);
                        if (response.status == 200) {
                            console.log("Login successful");
                            // place the loginSuccess state into our vuex store
                            commit('login_success', {
                                userEmail: userEmail,
                                userPass: password
                            });
                        }
                        resolve(response)
                    })
                    .catch(error => {
                        console.log("Error: " + error);
                        // place the loginError state into our vuex store
                        commit('login_error', {
                            userEmail: userEmail
                        });
                        reject("Invalid credentials!")
                    })
            })
        },
        register({ commit }, { userEmail, password }) {
            return new Promise((resolve, reject) => {
                console.log("Accessing  backend with user: '" + userEmail);
                api.login(userEmail, password)
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
        },
    },
    getters: {
        isLoggedIn: state => state.loginSuccess,
        hasLoginErrored: state => state.loginError,
        isRegistered: state => state.registerSuccess,
        hasRegisterErrored: state => state.registerError,
        getuserEmail: state => state.userEmail,
        getUserPass: state => state.userPass
    }
});