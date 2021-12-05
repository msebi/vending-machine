<template>
  <div v-if="!isVendingMachineEmpty">
    <div class="container">
      <div class="row justify-content-center">
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
        <div class="col-6">
          <h3 class="text-center">
            Purchase:
          </h3>
          <form @submit.prevent="callPurchase()">
            <div class="form-group">
              <label for="productId" class="form-label">Product #id</label>
              <div class="mt-2 col-md-12">
                <input
                  type="number"
                  id="productId"
                  min="0"
                  required
                  v-model="productId"
                />
              </div>
            </div>
            <h4 class="mt-2 col-md-12 text-center">
              Insert Coins
            </h4>
            <div class="form-group mt-2 col-md-12">
              <label for="coin5Cents">5¢</label>
              <div class="mt-2 col-md-12">
                <input
                  type="number"
                  id="coin5Cents"
                  min="0"
                  v-model="coin5Cents"
                />
              </div>
              <label for="coin5Cents">10¢</label>
              <div class="mt-2 col-md-12">
                <input
                  type="number"
                  id="coin10Cents"
                  min="0"
                  v-model="coin10Cents"
                />
              </div>
              <label for="coin5Cents">20¢</label>
              <div class="mt-2 col-md-12">
                <input
                  type="number"
                  id="coin20Cents"
                  min="0"
                  v-model="coin20Cents"
                />
              </div>
              <label for="coin5Cents">50¢</label>
              <div class="mt-2 col-md-12">
                <input
                  type="number"
                  id="coin50Cents"
                  min="0"
                  v-model="coin50Cents"
                />
              </div>
              <label for="coin5Cents">100¢</label>
              <div class="mt-2 col-md-12">
                <input
                  type="number"
                  id="coin100Cents"
                  min="0"
                  v-model="coin100Cents"
                />
              </div>
            </div>
            <div class="mt-2 col-md-12">
              <button type="submit" class="btn btn-primary">Buy!</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="alert alert-info">
      <strong>The Vending Machine is empty!</strong>
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
  returnedStatusMsg!: I.StatusMsg;

  productId = 0;
  coin5Cents = 0;
  coin10Cents = 0;
  coin20Cents = 0;
  coin50Cents = 0;
  coin100Cents = 0;

  isProductIdValid = false;

  get isVendingMachineEmpty(): boolean {
    console.log(
      "Products list size: " +
        VendingMachineStore.productsInVendingMachine.length
    );
    return VendingMachineStore.productsInVendingMachine.length === 0;
  }

  set setBoughtProductStatusMsg(statusMsg: I.StatusMsg) {
    this.returnedStatusMsg = { ...statusMsg };
  }

  get getBoughtProductStatusMsg(): I.StatusMsg {
    return this.returnedStatusMsg;
  }

  callPurchase(): void {
    console.log("purchasing product with id: " + this.productId);

    const productsToPurchase: Array<I.Product> = new Array<I.Product>();
    // User inputs product id, remaining fields are fetched from store
    // Error is signaled if product id is not found or there are multiple
    // entrie of it
    const matchingProductsInVendingMachine: Array<I.Product> = VendingMachineStore.getProductsGetter.filter(
      (prod) => prod.id === this.productId
    );

    if (
      matchingProductsInVendingMachine.length === 0 ||
      matchingProductsInVendingMachine.length > 1
    ) {
      this.isProductIdValid = false;
      return;
    }

    this.isProductIdValid = true;

    const productToPurchase: I.Product = {
      id: this.productId,
      productName: "",
      productPrice: 0,
      productQty: 1,
    };
    productsToPurchase.push(productToPurchase);
    const deposit: I.Deposit = {
      5: this.coin5Cents,
      10: this.coin10Cents,
      20: this.coin20Cents,
      50: this.coin50Cents,
      100: this.coin100Cents,
    };

    const purchaseOrder: I.Order = {
      products: productsToPurchase,
      deposit: deposit,
    };

    console.log("purchase order: " + JSON.stringify(purchaseOrder));
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
