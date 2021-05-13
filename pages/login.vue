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
          <span @click="onSubmit()">Sign in</span>
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
      await this.$store
            .dispatch("onSubmit", { ...this.form, vm: this }).then(res => {
              res === true && this.$router.push('/')
            })
    },
    async doSignUp() {
      await this.$store.dispatch('onCreateUser', {...this.form, vm: this})
      
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
