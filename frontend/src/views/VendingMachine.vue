<template>
  <div class="unprotected">
    <div class="d-flex justify-content-center align-items-center container">
      <div class="row">
        <div class="col-sm-10 offset-sm-1 text-center">
          <h1 class="display-6">Vending Machine</h1>
          <div v-if="isAuthenticated">
            <Products />
          </div>
          <div v-else>
            <div class="alert alert-info">
              <strong>Login to start using vending machine!</strong>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>

  <!-- <form @submit.prevent="callLogin()">
    <input type="text" placeholder="username" v-model="user" />
    <input type="password" placeholder="password" v-model="password" />
    <button type="submit" class="btn btn-primary">Login</button>
    <p v-if="error" class="error">Bad login information</p>
  </form> -->
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Products from "./Products.vue";
import VendingMachineStore from "../store/vending-machine";
import * as I from "../store/types";

// https://github.com/vuejs/vue-class-component/issues/406
@Options({
  name: "VendingMachine",
  components: {
    Products,
  },
})
export default class VendingMachine extends Vue {
  products: I.Product[] = [];

  get isAuthenticated(): boolean {
    console.log("isAuthenticated:" + VendingMachineStore.isLoggedIn);
    return VendingMachineStore.isLoggedIn;
  }

  get isVendingMachineEmpty(): boolean {
    console.log(
      "Products list size: " +
        VendingMachineStore.productsInVendingMachine.length
    );
    return VendingMachineStore.productsInVendingMachine.length === 0;
  }
}
</script>
