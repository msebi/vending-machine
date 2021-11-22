<template>
  <div id="nav">
    <!-- <router-link to="/">Hello</router-link> | -->
    <!-- <router-link to="/callservice">Service</router-link> |
    <router-link to="/bootstrap">Bootstrap</router-link> | -->
    <!-- <router-link to="/user">User</router-link> | -->
    <a href="" v-if="isAuthenticated" @click.prevent="onClickLogout">Logout</a>
    <router-link to="/login" v-else>Login</router-link> |
    <router-link to="/register">Register</router-link> |
    <!-- <router-link to="/vending-machine">Vending Machine</router-link> | -->
    <router-link to="/protected">Protected</router-link>
  </div>
  <router-view />
</template>

<script lang="ts">
import VendingMachine from "./store/vending-machine";
import router from "./router/index";

export default {
  computed: {
    isAuthenticated(): string {
      return VendingMachine.isLoggedIn;
    },
  },
  methods: {
    onClickLogout(): void {
      VendingMachine.logout().then(() => router.push("/"));
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
