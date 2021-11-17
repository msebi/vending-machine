import { RootState } from './root-state'
import { VendingMachineState } from './types';
import { GetterTree } from 'vuex';

export const getters: GetterTree<VendingMachineState, RootState> = {
    isLoggedIn: state => {
        state.accessToken = state.accessToken || localStorage.accessToken
        return state.accessToken
    },
    hasLoginErrored: state => state.loginError,
    isRegistered: state => state.registerSuccess,
    hasRegisterErrored: state => state.registerError,
    getUserEmail: state => state.userEmail,
    getUserPass: state => state.userPass,
    getProductsInvendingMachine: state => state.productsInVendingMachine,
    getOrder: state => state.order
};
