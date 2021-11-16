import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { VendingMachineState, Product } from './types';
import { RootState } from './root-state';

export const state: VendingMachineState = {
    loginSuccess: false,
    loginError: false,
    logoutSuccess: false,
    logoutError: false,
    registerSuccess: false,
    registerError: false,
    userEmail: "",
    userPass: "",
    accessToken: "",
    productsInVendingMachine: Array<Product>(),
    order: {
        products: Array<Product>(),
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
    }
}

const namespaced = true;

export const profile: Module<VendingMachineState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};