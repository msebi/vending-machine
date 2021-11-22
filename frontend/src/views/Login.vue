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
                  v-model="userEmail"
                />
              </div>
              <div class="form-group row mt-2">
                <label for="password">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="passwordId"
                  placeholder="Enter password"
                  v-model="userPassword"
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
import { Vue, Component } from "vue-property-decorator";
import VendingMachine from "../store/vending-machine";
import * as I from "../store/types";
import router from "../router/index";

@Component
class Login extends Vue {
  userEmail = "";
  userPassword = "";

  callLogin(): void {
    VendingMachine.clear_errors();
    console.log(
      "logging in with user: " + this.userEmail + " pass: " + this.userPassword
    );

    const loginData: I.CredentialsLoginObject = {
      userEmail: this.userEmail,
      userPass: this.userPassword,
      accessToken: "",
    };

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
  // methods: {
  //     callLogin() {
  //       this.errors = [];
  //       console.log(
  //         "logging in with user: " + this.userEmail + " pass: " + this.password
  //       );
  //       this.$store
  //         .dispatch("login", {
  //           userEmail: this.userEmail,
  //           password: this.password,
  //         })
  //         .then(() => {
  //           console.log("Open vending machine");
  //           this.$router.push("/vending-machine");
  //         })
  //         .catch((error: AxiosError) => {
  //           this.loginError = true;
  //           this.errors.push(error);
  //           this.error = true;
  //         });
  //   }
  // }
}

// interface State {
//   loginError: boolean;
//   userEmail: string;
//   password: string;
//   error: boolean;
//   errors: AxiosError[];
// }

// export default defineComponent({
//   name: "Login",

//   data: (): State => {
//     return {
//       loginError: false,
//       userEmail: "user@email.com",
//       password: "user",
//       error: false,
//       errors: [],
//     };
//   },
//   methods: {
//     callLogin() {
//       this.errors = [];
//       console.log(
//         "logging in with user: " + this.userEmail + " pass: " + this.password
//       );
//       this.$store
//         .dispatch("login", {
//           userEmail: this.userEmail,
//           password: this.password,
//         })
//         .then(() => {
//           console.log("Open vending machine");
//           this.$router.push("/vending-machine");
//         })
//         .catch((error: AxiosError) => {
//           this.loginError = true;
//           this.errors.push(error);
//           this.error = true;
//         });
//     },
//   },
// });
</script>
