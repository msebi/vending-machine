<template>
  <div class="unprotected">
    <div class="d-flex justify-content-center align-items-center container">
      <div class="row">
        <div class="col-sm-10 offset-sm-1 text-center">
          <h1 class="display-6">Vending Machine</h1>
          <div class="info-form" v-if="isAuthenticated">
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
                  <th scope="row">1</th>
                  <td>{{ product.id }}</td>
                  <td>{{ product.productName }}</td>
                  <td>{{ product.productPrice }}</td>
                  <td>{{ product.productQty }}</td>
                </tr>
              </tbody>
            </table>
            <!-- <form
              @submit.prevent="buy()"
              class="form-inline justify-content-center"
            >
              <div class="form-group row mt-2">
                <label for="email">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="emailId"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  v-model="email"
                />
              </div>
              <div class="form-group row mt-2">
                <label for="password">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="passwordId"
                  placeholder="Enter password"
                  v-model="password"
                />
              </div>

              <button type="submit" class="btn btn-primary row mt-2">
                Register
              </button>
              <p v-if="error" class="error">Bad login information</p>
            </form> -->
          </div>
          <div v-else>
            Not logged in!
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
import { Vue, Component } from "vue-property-decorator";
import VendingMachineStore from "../store/vending-machine";
import * as I from "../store/types";

@Component
class VendingMachine extends Vue {
  products: I.Product[] = [];

  // TODO: do we need async here
  created() {
    VendingMachineStore.getProductsAction()
      .then(() => {
        this.products = VendingMachineStore.getProductsGetter;
      })
      .catch((error) => {
        console.log("Failed to get products: " + error);
      });
  }
}
export default VendingMachine;
</script>
