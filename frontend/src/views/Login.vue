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
                <label for="user">User</label>
                <input
                  type="user"
                  class="form-control"
                  id="userId"
                  aria-describedby="userHelp"
                  placeholder="Enter user"
                  v-model="user"
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
import { defineComponent } from "vue";
import { AxiosError } from "axios";

interface State {
  loginError: boolean;
  user: string;
  password: string;
  error: boolean;
  errors: AxiosError[];
}

export default defineComponent({
  name: "Login",

  data: (): State => {
    return {
      loginError: false,
      user: "",
      password: "",
      error: false,
      errors: [],
    };
  },
  methods: {
    callLogin() {
      this.errors = [];
      this.$store
        .dispatch("login", { user: this.user, password: this.password })
        .then(() => {
          this.$router.push("/Protected");
        })
        .catch((error: AxiosError) => {
          this.loginError = true;
          this.errors.push(error);
          this.error = true;
        });
    },
  },
});
</script>
