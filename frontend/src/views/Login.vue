<template>
  <div class="unprotected" v-if="loginError">
    <h1>
      <span class="badge bg-danger">Login failed</span>
    </h1>
  </div>
  <div class="unprotected" v-else>
    <div class="d-flex justify-content-center align-items-center container">
      <div class="row">
        <div class="col-sm-10 offset-sm-1 text-center">
          <h1 class="display-6">Log in to start using vending machine</h1>
          <div class="info-form">
            <form
              @submit.prevent="callLogin()"
              class="form-inline justify-content-center"
            >
              <div class="form-group row mt-2">
                <label for="user">User email</label>
                <input
                  type="user"
                  class="form-control"
                  id="userEmailId"
                  aria-describedby="userHelp"
                  placeholder="Enter mail"
                  v-model="username"
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
                Login
              </button>
              <p v-if="error" class="error">Bad login information</p>
            </form>
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
import { AxiosError } from "axios";
import { Options, Vue } from "vue-class-component";
import VendingMachine from "../store/vending-machine";
import * as I from "../store/types";
import router from "../router/index";

@Options({
  name: "Login",
})
export default class Login extends Vue {
  username = "user@email.com";
  password = "user";

  callLogin(): void {
    VendingMachine.clear_errors();
    console.log(
      "logging in with user: " + this.username + " pass: " + this.password
    );

    const loginData: I.CredentialsLoginObject = {
      username: this.username,
      password: this.password,
      accessToken: "",
    };

    // VendingMachine.getHelloMessage()
    //   .then(() => {
    //     console.log("Got hello message!");
    //   })
    //   .catch((error: AxiosError) => {
    //     console.log("Err getting hello message: " + error);
    //   });

    VendingMachine.login(loginData)
      .then(() => {
        console.log("Open vending machine");
        router.push("/vending-machine");
      })
      .catch((error: AxiosError) => {
        console.log("Err while logging in: " + error);
        VendingMachine.login_error();
      });
  }
}
</script>
