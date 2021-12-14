<template>
  <div class="col-6">
    <h3 class="text-center">Products:</h3>
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
        <tr v-for="product in getProductsInVendingMachine" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.productName }}</td>
          <td>{{ product.productPrice }}</td>
          <td>{{ product.productQty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import VendingMachineStore from "../store/vending-machine";
import * as I from "../store/types";

@Options({
  name: "Products",
})
export default class VendingMachine extends Vue {
  get getProductsInVendingMachine(): Array<I.Product> {
    return VendingMachineStore.getProductsGetter;
  }
}
</script>
