<template>
  <div id="nav">
    <a href="" v-if="isAuthenticated" @click.prevent="onClickLogout">
      Logout
    </a>
    <router-link to="/login" v-else> Login </router-link>
    <router-link v-if="!isAuthenticated" to="/register"> Register </router-link>
    <router-link v-if="isAuthenticated" to="/vending-machine">
      Vending Machine
    </router-link>

    <!-- <router-link to="/protected">Protected</router-link> -->
  </div>
  <router-view />
</template>

<script lang="ts">
import VendingMachineStore from "./store/vending-machine";
import router from "./router/index";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "App",
})
export default class App extends Vue {
  get isAuthenticated(): boolean {
    console.log("App.vue getter: " + VendingMachineStore.getIsLoggedIn);
    return VendingMachineStore.getIsLoggedIn;
  }

  onClickLogout(): void {
    VendingMachineStore.logout().then(() => router.push("/"));
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
