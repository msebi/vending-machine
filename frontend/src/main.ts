import { createApp } from 'vue';
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import VendingMachineStore from "./store/vending-machine";

console.log("Access token in local storage: " + localStorage.accessToken);
VendingMachineStore.set_init_access_token(localStorage.accessToken);

createApp(App).use(router).mount('#app');