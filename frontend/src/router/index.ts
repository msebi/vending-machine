import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import VendingMachineView from '../views/VendingMachine.vue'

// import store from '../store'
// import { store } from '../store/index'
import VendingMachine from '../store/vending-machine'

const routes: Array<RouteRecordRaw> = [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/vending-machine', component: VendingMachineView },

    // {
    //     path: '/protected',
    //     component: Protected,
    //     meta: {
    //         requiresAuth: true
    //     }
    // },

    // otherwise redirect to home
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL), // uris without hashes #, see https://router.vuejs.org/guide/essentials/history-mode.html#html5-history-mode
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (VendingMachine.isLoggedIn !== "") {
            next({
                path: '/login'
            })
        } else {
            next();
        }
    } else {
        next(); // make sure to always call next()!
    }
});

export default router;