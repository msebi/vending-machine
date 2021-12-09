<template>
  <div class="col-6">
    <h3 class="text-center">Purchase:</h3>
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
      <h4 class="mt-2 col-md-12 text-center">Insert Coins</h4>
      <div class="form-group mt-2 col-md-12">
        <label for="coin5Cents">5¢</label>
        <div class="mt-2 col-md-12">
          <input type="number" id="coin5Cents" min="0" v-model="coin5Cents" />
        </div>
        <label for="coin5Cents">10¢</label>
        <div class="mt-2 col-md-12">
          <input type="number" id="coin10Cents" min="0" v-model="coin10Cents" />
        </div>
        <label for="coin5Cents">20¢</label>
        <div class="mt-2 col-md-12">
          <input type="number" id="coin20Cents" min="0" v-model="coin20Cents" />
        </div>
        <label for="coin5Cents">50¢</label>
        <div class="mt-2 col-md-12">
          <input type="number" id="coin50Cents" min="0" v-model="coin50Cents" />
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
      <div
        class="d-flex justify-content-center"
        v-if="this.WasBuyButtonClicked && !this.IsProductIdValid"
      >
        <div class="mt-2 col-md-12 alert alert-danger w-25 p-3" role="alert">
          Invalid product Id!
        </div>
      </div>
      <div
        class="d-flex justify-content-center"
        v-if="
          this.WasBuyButtonClicked &&
          this.IsProductIdValid &&
          this.BuyNetworkError
        "
      >
        <div class="mt-2 col-md-12 alert alert-danger w-25 p-3" role="alert">
          Failed to purchase! Reason:
          {{ this.BuyNetworkErrorMsg }}
        </div>
      </div>
      <div
        class="d-flex justify-content-center"
        v-if="
          this.WasBuyButtonClicked &&
          this.IsProductIdValid &&
          !this.BuyNetworkError &&
          !this.WasPurchaseSuccessful
        "
      >
        <div class="mt-2 col-md-12 alert alert-danger w-25 p-3" role="alert">
          Could not get
          {{ this.PurchasedProductName }}! Reason:
          {{ this.BuyErrorMessage.statusMsg }}
        </div>
      </div>
      <div
        class="d-flex justify-content-center"
        v-if="
          this.WasBuyButtonClicked &&
          this.IsProductIdValid &&
          !this.BuyNetworkError &&
          this.WasPurchaseSuccessful
        "
      >
        <div class="mt-2 col-md-12 alert alert-success w-25 p-3" role="alert">
          Got
          {{ this.PurchasedProductName }}! Enjoy your day!
        </div>
      </div>
    </form>
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
  name: "ProductsPurchaseHandler",
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

  isProductIdValid = true;
  wasBuyButtonClicked = false;

  // set BoughtProductStatusMsg(statusMsg: I.StatusMsg) {
  //   this.returnedStatusMsg = { ...statusMsg };
  // }

  set WasBuyButtonClicked(value: boolean) {
    this.wasBuyButtonClicked = value;
  }

  get WasBuyButtonClicked(): boolean {
    return this.wasBuyButtonClicked;
  }

  set IsProductIdValid(value: boolean) {
    this.isProductIdValid = value;
  }

  get IsProductIdValid(): boolean {
    return this.isProductIdValid;
  }

  get BoughtProductStatusMsg(): I.StatusMsg {
    return this.returnedStatusMsg;
  }

  get HasBoughtErrored(): boolean {
    return VendingMachineStore.getHasBoughtErrored;
  }

  get BuyNetworkError(): boolean {
    return VendingMachineStore.getBuyNetworkError;
  }

  get BuyNetworkErrorMsg(): string {
    return VendingMachineStore.getBuyNetworkErrorMsg;
  }

  get BuyErrorMessage(): I.StatusMsg {
    return VendingMachineStore.getBuyErrorMessage;
  }

  get PurchasedProductName(): string {
    // return "";
    return VendingMachineStore.getProcessedOrder.products[0].productName;
  }

  get WasPurchaseSuccessful(): boolean {
    if (!VendingMachineStore.getHasBoughtErrored) {
      return VendingMachineStore.getBuySuccessMessage.status === "SUCCESS";
    }
    return false;
  }

  // get WasBuyButtonClicked(): boolean {
  //   return this.wasBuyButtonClicked;
  // }

  // set WasBuyButtonClicked(wasBuyButtonClicked: boolean) {
  //   this.wasBuyButtonClicked = wasBuyButtonClicked;
  // }

  created(): void {
    console.log("wasBuyButtonClicked: " + this.wasBuyButtonClicked);
  }

  callPurchase(): void {
    console.log("Purchasing product with id: " + this.productId);

    const productsToPurchase: Array<I.Product> = new Array<I.Product>();
    // User inputs product id, remaining fields are fetched from store
    // Error is signaled if product id is not found or there are multiple
    // entrie of it
    const matchingProductsInVendingMachine: Array<I.Product> =
      VendingMachineStore.getProductsGetter.filter(
        (prod) => prod.id === this.productId
      );

    if (
      matchingProductsInVendingMachine.length === 0 ||
      matchingProductsInVendingMachine.length > 1
    ) {
      this.IsProductIdValid = false;
      this.WasBuyButtonClicked = true;
      console.log("this.isProductIdValid: " + this.isProductIdValid);
      return;
    }

    this.isProductIdValid = true;

    const productToPurchase: I.Product = {
      id: this.productId,
      productName: matchingProductsInVendingMachine[0].productName,
      productPrice: matchingProductsInVendingMachine[0].productPrice,
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

    console.log("Purchase order: " + JSON.stringify(purchaseOrder));

    VendingMachineStore.buyProduct(purchaseOrder)
      .then(() => {
        console.log("Check if purchase is successful");

        this.WasBuyButtonClicked = true;
      })
      .catch((error) => {
        console.log("Failed to purchase product; error: " + error);
        console.log("Failed; wasBuyButtonClicked: " + this.WasBuyButtonClicked);
        this.WasBuyButtonClicked = true;
      });
  }
}
</script>
