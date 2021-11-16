import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import * as I from './store/index'

declare module '@vue/runtime-core' {
    // declare your own store states
    interface State {
        loginSuccess: boolean;
        loginError: boolean;
        logoutSuccess: boolean;
        logoutError: boolean;
        registerSuccess: boolean;
        registerError: boolean;
        userEmail: string;
        userPass: string;
        accessToken: string;
        productsInVendingMachine: I.Product[];
        order: I.Order;
    }

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}