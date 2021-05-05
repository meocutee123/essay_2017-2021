<template>
  <div class="p-2">
    <div class="ml-auto login-form">
      <h1>{{ formText.header }}</h1>
      <form @submit.prevent="onSubmit()">
        <b-row v-if="isSignUp" class="pr-3">
          <b-col>
            <label for="first">First name: </label>
            <b-input
              type="text"
              id="first"
              v-model.trim="form.name.firstName"
              placeholder="First name"
            />
          </b-col>
          <b-col>
            <label for="last">Last name: </label>
            <b-input
              type="text"
              id="last"
              v-model.trim="form.name.lastName"
              placeholder="First name"
            />
          </b-col>
        </b-row>
        <b-row class="pr-3">
          <b-col cols="12">
            <label for="email">Email: </label>
            <b-input
              type="text"
              id="email"
              v-model.trim="form.email"
              placeholder="Email"
            />
          </b-col>
          <b-col cols="12">
            <label for="password">Password: </label>
            <b-input
              type="text"
              id="password"
              v-model.trim="form.password"
              placeholder="Password"
            />
          </b-col>
          <b-col v-if="isSignUp" cols="12">
            <label for="confirmPassword">Confirm password: </label>
            <b-input
              type="text"
              id="confirmPassword"
              v-model.trim="form.confirmPassword"
              placeholder="Password"
            />
          </b-col>
        </b-row>

        <button type="submit" :disabled="isDisabled">
          {{ formText.button }}
        </button>
        <span class="w-100" v-if="isSignUp">
          <span @click="onSignUp()">Sign in</span>
        </span>
      </form>
    </div>
    <div class="mt-5 w-100 d-flex justify-content-around">
      <span @click="onCreate()">Create an account</span>
      <span
        >Or login with
        <b-icon class="mx-3" icon="facebook" scale="2rem"></b-icon
        ><b-icon class="mx-3" icon="twitter" scale="2rem"></b-icon
        ><b-icon class="mx-3" icon="instagram" scale="2rem"></b-icon
      ></span>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  layout: "empty",
  data() {
    return {
      isDisabled: false,
      isSignUp: false,
      formText: {
        header: "Sign in",
        button: "Sign in"
      },
      form: {
        name: {
          firstName: "",
          lastName: ""
        },
        email: "",
        password: "",
        confirmPassword: ""
      }
    };
  },
  methods: {
    onCreate() {
      (this.formText.header = "Sign up"),
        (this.formText.button = "Sign up"),
        (this.isSignUp = true);
    },
    onSignUp() {
      (this.formText.header = "Sign in"),
        (this.formText.button = "Sign in"),
        (this.isSignUp = false);
    },
    async onSubmit() {
      this.isDisabled = true;
      this.isSignUp
        ? this.doSignUp()
        : await firebase
            .auth()
            .signInWithEmailAndPassword(this.form.email, this.form.password)
            .then(response => {
              localStorage.setItem("token", response.user.refreshToken);
              localStorage.setItem("loged-id", response.user.uid);
              this.isSignUp = false;
              this.isDisabled = false;
              this.$router.push("/");
            })
            .catch(err => {
              this.isDisabled = false;
              this.$bvToast.toast("Username or password is incorrect!", {
                title: "Error!",
                variant: "danger",
                solid: true
              });
            });
    },
    async doSignUp() {
      this.isDisabled = true;
      if (this.form.password == this.form.confirmPassword) {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.form.email, this.form.password)
          .then(response => {
            this.$bvToast.toast("Account created successfully!", {
              title: "Success",
              variant: "success",
              solid: true
            });
            this.$axios.post("users.json", {
              email: this.form.email,
              password: this.form.password,
              id: response.user.uid,
              name:{
                firstName: this.form.name.firstName,
                lastName: this.form.name.lastName
              }
            });
            this.isDisabled = false;
            this.isSignUp = false;
            this.formText.header = "Sign in";
            this.formText.button = "Sign in";
          })
          .catch(err => {
            this.isDisabled = false;
            this.$bvToast.toast(err.message, {
              title: "Error",
              variant: "danger",
              solid: true
            });
          });
        return;
      }
      this.$bvToast.toast("Password and confirm password do not match", {
        title: "Error",
        variant: "danger",
        solid: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-form {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  border: 1px solid #41b883;
  border-radius: 1rem;
  padding: 0.5em;
  form {
    div {
      align-items: center;
    }

    div > label {
      font-weight: bold;
    }
    div > input {
      padding: 0.3em;
      margin: 0 0 1rem 1rem;
      border: none;
      outline: none;
      border-bottom: 1px solid #e4e6eb;
      width: 100%;
      &:focus {
      }
    }
    button {
      width: 30%;
      border: none;
      outline: none;
      border-radius: 0.5rem;
      padding: 0.3rem 0.6rem;
      font-weight: bold;
      background-color: #41b883;
      transition: 0.3s;
      &:active {
        transform: scale(0.9);
      }
    }
  }
  h1 {
    font-weight: bold;
    line-height: 100px;
  }
}
.w-100 {
  span:nth-child(1) {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  span:nth-child(2) {
    .b-icon:hover {
      cursor: pointer;
    }
  }
}
.inValidMessage {
  color: red;
  font-size: 0.8rem;
}
</style>
