import { VendingMachineState } from './types';
import { MutationTree } from 'vuex';

export const mutations: MutationTree<VendingMachineState> = {
    login_success(state, payload) {
        state.loginSuccess = true;
        state.userEmail = payload.userEmail;
        state.userPass = payload.userPass;
        state.accessToken = payload.accessToken;
    },
    login_error(state, payload) {
        state.loginError = true;
        state.userEmail = payload.userEmail;
    },
    logout_success(state) {
        state.accessToken = "";
        state.logoutSuccess = true;
        delete localStorage.accessToken;
    },
    logout_error(state) {
        state.logoutSuccess = false;
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
};