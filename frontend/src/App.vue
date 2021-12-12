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

    <!-- <router-link to="/vending-machine">Vending Machine</router-link> | -->
    <!-- <router-link to="/protected">Protected</router-link> -->
  </div>
  <router-view />
</template>

<script lang="ts">
import VendingMachineStore from "./store/vending-machine";
import router from "./router/index";

export default {
  computed: {
    isAuthenticated(): boolean {
      console.log("App.vue: " + VendingMachineStore.getIsLoggedIn);
      if (VendingMachineStore.getIsLoggedIn) return true;
      return false;
    },
  },
  methods: {
    onClickLogout(): void {
      VendingMachineStore.logout().then(() => router.push("/"));
    },
  },
};
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
