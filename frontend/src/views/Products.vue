<template>
  <div class="unprotected">
    <div class="d-flex justify-content-center align-items-center container">
      <div class="row">
        <div class="col-sm-10 offset-sm-1 text-center">
          <div v-if="!isVendingMachineEmpty">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">$</th>
                  <th scope="col">Left</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td>{{ product.id }}</td>
                  <td>{{ product.productName }}</td>
                  <td>{{ product.productPrice }}</td>
                  <td>{{ product.productQty }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <div class="alert alert-info">
              <strong>The Vending Machine is empty!</strong>
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
import VendingMachineStore from "../store/vending-machine";
import * as I from "../store/types";

@Options({
  name: "Products",
})
export default class VendingMachine extends Vue {
  products: Array<I.Product> = new Array<I.Product>();

  get isVendingMachineEmpty(): boolean {
    console.log(
      "Products list size: " +
        VendingMachineStore.productsInVendingMachine.length
    );
    return VendingMachineStore.productsInVendingMachine.length === 0;
  }
  // TODO: do we need async here
  created(): void {
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
