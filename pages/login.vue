<template>
  <div class="card p-2">
    <div class="d-flex justify-content-between align-items-center">
      <img src="/Chat-Illustration.jpg" alt="chat" />
      <div class="login-form">
        <h1>{{ formText.header }}</h1>
        <form @submit.prevent="onSubmit()">
          <div class="p-2">
            <label for="email">Email: </label>
            <input
              type="text"
              id="email"
              v-model="form.email"
              placeholder="Email"
            /><br />
          </div>
          <div class="p-2">
            <label for="password">Password: </label>
            <input
              type="text"
              id="password"
              v-model="form.password"
              placeholder="Password"
            /><br />
          </div>
          <div class="p-2" v-if="isSignUp">
            <label for="confirmPassword">Confirm password: </label>
            <input
              type="text"
              id="confirmPassword"
              v-model="form.confirmPassword"
              placeholder="Password"
            /><br />
          </div>

          <button type="submit">{{ formText.button }}</button>
        </form>
      </div>
    </div>
    <div class="w-100 d-flex justify-content-around">
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
      isSignUp: false,
      formText: {
        header: "Sign in",
        button: "Sign in"
      },
      form: {
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

    async onSubmit() {
      this.isSignUp
        ? this.doSignUp()
        : await firebase
            .auth()
            .signInWithEmailAndPassword(this.form.email, this.form.password)
            .then(response => {
              localStorage.setItem("token", response.user.refreshToken )
              this.isSignUp = false;
              this.$router.push("/");
            })
            .catch(err => {
              this.$bvToast.toast("Username or password is incorrect!", {
                title: "Error!",
                variant: "danger",
                solid: true
              });
            });
    },
    async doSignUp() {
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
            this.$axios.post('users.json', {
              email: this.form.email,
              password: this.form.password,
              id: response.user.uid
            })
            this.isSignUp = false;
            this.formText.header = "Sign in";
            this.formText.button = "Sign in";
          })
          .catch(err => {
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
.card {
  margin: 4rem;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.4rem;
  outline: 0;
  box-shadow: 2px 3px 3px 3px #e4e6eb;
}
img {
  max-height: 500px;
}
.login-form {
  border-bottom: 2px solid #ffadad;
  border-left: 2px solid #ffadad;
  border-radius: 1rem;
  padding: 0.5em;
  form {
    div {
      align-items: center;
    }
    width: 400px;
    div > label {
      font-weight: bold;
      width: 85px;
    }
    div > input {
      padding: 0.3em;
      margin-left: 1rem;
      border: none;
      outline: none;
      border-bottom: 1px solid #e4e6eb;
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
      background-color: #ffadad;
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
