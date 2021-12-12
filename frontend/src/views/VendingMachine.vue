<template>
  <div>
    <h1 class="display-6">Vending Machine</h1>
    <div v-if="isAuthenticated && !isVendingMachineEmpty">
      <div class="container">
        <div class="row justify-content-center">
          <Products />
          <ProductsPurchaseHandler />
        </div>
      </div>
    </div>
    <div v-if="isAuthenticated && isVendingMachineEmpty">
      <div class="container">
        <div class="row justify-content-center">
          <div class="alert alert-info">
            <strong>Vending Machine is empty!</strong>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!isAuthenticated">
      <div class="alert alert-info">
        <strong>Login to start using vending machine!</strong>
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
import ProductsPurchaseHandler from "./ProductsPurchaseHandler.vue";
import VendingMachineStore from "../store/vending-machine";
import * as I from "../store/types";

// https://github.com/vuejs/vue-class-component/issues/406
@Options({
  name: "VendingMachine",
  components: {
    Products,
    ProductsPurchaseHandler,
  },
})
export default class VendingMachine extends Vue {
  products: I.Product[] = [];

  get isVendingMachineEmpty(): boolean {
    console.log(
      "Products list size: " +
        VendingMachineStore.productsInVendingMachine.length
    );
    return VendingMachineStore.productsInVendingMachine.length === 0;
  }

  get isAuthenticated(): boolean {
    console.log("isAuthenticated:" + VendingMachineStore.getIsLoggedIn);
    return VendingMachineStore.getIsLoggedIn;
  }

  created(): void {
    // Initialize access token first
    if (
      VendingMachineStore.getAccessToken &&
      VendingMachineStore.getAccessToken.length > 0
    )
      VendingMachineStore.set_bearer_access_token(
        VendingMachineStore.getAccessToken
      );
    VendingMachineStore.getProductsAction()
      .then(() => {
        this.products = VendingMachineStore.getProductsGetter;
      })
      .catch((error) => {
        console.log("Failed to get products: " + error);
      });
  }
}
</script>
