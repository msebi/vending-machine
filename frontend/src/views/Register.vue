<template>
  <div class="unprotected" v-if="registerError">
    <h1>
      <span class="badge bg-danger">Register failed</span>
    </h1>
  </div>
  <div class="unprotected" v-else>
    <div class="d-flex justify-content-center align-items-center container">
      <div class="row">
        <div class="col-sm-10 offset-sm-1 text-center">
          <h1 class="display-6">Register an account</h1>
          <div class="info-form">
            <form
              @submit.prevent="callRegister()"
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
import { defineComponent } from "vue";
import { AxiosError } from "axios";

interface State {
  registerError: boolean;
  email: string;
  password: string;
  error: boolean;
  errors: AxiosError[];
}

export default defineComponent({
  name: "Login",

  data: (): State => {
    return {
      registerError: false,
      email: "",
      password: "",
      error: false,
      errors: [],
    };
  },
  methods: {
    callLogin() {
      this.errors = [];
      this.$store
        .dispatch("register", { user: this.email, password: this.password })
        .then(() => {
          this.$router.push("/login");
        })
        .catch((error: AxiosError) => {
          this.registerError = true;
          this.errors.push(error);
          this.error = true;
        });
    },
  },
});
</script>
