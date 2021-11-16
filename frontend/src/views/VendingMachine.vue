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
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
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
import { defineComponent } from "vue";
import { AxiosError } from "axios";
import store from "../store/index";
import * as I from "../api/interfaces";

interface State {
  order: I.Order;
  buyError: boolean;
  error: boolean;
  errors: AxiosError[];
}

export default defineComponent({
  name: "Vending Machine",

  data: (): State => {
    return {
      order: {
        products: [],
        deposit: {
          "5": 0,
          "10": 0,
          "20": 0,
          "50": 0,
          "100": 0,
        },
      },
      buyError: false,
      error: false,
      errors: [],
    };
  },

  created() {
    console.log(
      "propertyComputed will update, as this.property is now reactive."
    );
  },

  computed: {
    isAuthenticated() {
      return store.getters.isLoggedIn;
    },
  },
  methods: {
    openLogin() {
      this.$router.push("/");
    },
  },
});
</script>
