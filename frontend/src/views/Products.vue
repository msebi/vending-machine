<template>
  <div class="col-6">
    <h3 class="text-center">
      Products:
    </h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Product Name</th>
          <th scope="col">Price (cents)</th>
          <th scope="col"># Left</th>
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
  products: Array<I.Product> = VendingMachineStore.getProductsGetter;
}
</script>
