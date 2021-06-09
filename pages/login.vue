<template>
  <div>
    <div class="center">
      <button @click="login()">
        <img
          src="https://img-authors.flaticon.com/google.jpg"
          alt=""
          class="mr-2"
        />
        Sign in with Google
      </button>
    </div>
    <div v-if="isLoading" class="overlay">
      <div class="spinner"></div>
    </div>
  </div>

  <!-- <div class="ml-auto login-form">
    <form @submit.prevent="onSubmit()">
      <div v-if="isSignUp">
        <input type="text" id="first" v-model.trim="form.name.firstName" />

        <input type="text" id="last" v-model.trim="form.name.lastName" />
      </div>

      <input
        type="text"
        id="email"
        v-model.trim="form.email"
        placeholder="Email"
      />

      <input
        type="text"
        id="password"
        v-model.trim="form.password"
        placeholder="Password"
      />

      <div v-if="isSignUp">
        <input
          type="text"
          id="confirmPassword"
          v-model.trim="form.confirmPassword"
        />
      </div>

      <button type="submit" :disabled="isDisabled">
        {{ formText.button }}
      </button>
      <span v-if="isSignUp">
        <span @click="onSubmit()">Sign in</span>
      </span>
    </form>

    <div>
      <span @click="onCreate()">Create an account</span>
    </div>
  </div> -->
</template>

<script>
import firebase from "firebase/app";
export default {
  layout: "empty",
  data() {
    return {
      isLoading: false
    };
  },
  mounted() {
    // this.getRealtimeUpdate();
  },
  methods: {
    async login(type) {
      this.isLoading = true;
      this.$auth.loginWith('google')
      this.isLoading = false;
    },
    signOut() {
      // [START auth_sign_out]
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          console.log("Sign-out successful");
        })
        .catch(error => {
          // An error happened.
        });
      // [END auth_sign_out]
    },
    async onSave(profile) {},
    getRealtimeUpdate() {
      firebase
        .firestore()
        .collection("users")
        .onSnapshot(doc => {
          console.log(doc);
        });
    }
    // onCreate() {
    //   (this.formText.header = "Sign up"),
    //     (this.formText.button = "Sign up"),
    //     (this.isSignUp = true);
    // },
    // onSignUp() {
    //   (this.formText.header = "Sign in"),
    //     (this.formText.button = "Sign in"),
    //     (this.isSignUp = false);
    // },
    // async onSubmit() {
    //   this.isSignUp
    //     ? this.doSignUp()
    //     : await this.$store
    //         .dispatch("onSubmit", { ...this.form, vm: this })
    //         .then(response => {
    //           if (response) {

    //           }
    //         });
    // },
    // async doSignUp() {
    //   await this.$store.dispatch("onCreateUser", { ...this.form, vm: this });
    // }
  }
};
</script>

<style lang="scss" scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: #ebebeb;
  border: none;
  button {
    padding: 0.5rem 1rem;
    border: none;
    outline: none;
    margin: 1rem 2rem;
    border-radius: 2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    width: 250px;
    transition: 0.5s;
    &:nth-child(2) {
      background: #1877f2;
      color: #fff;
      .b-icon {
        font-size: 2rem;
      }
    }
    &:nth-child(1) {
      img {
        width: 2rem;
        border-radius: 50%;
      }
      background: #ebebeb;
      color: #000;
    }
    &:active {
      transform: scale(0.9);
    }
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
}
.spinner {
  height: 60px;
  width: 60px;
  -webkit-animation: rotation 0.6s infinite linear;
  -moz-animation: rotation 0.6s infinite linear;
  -o-animation: rotation 0.6s infinite linear;
  animation: rotation 0.6s infinite linear;
  border-left: 6px solid rgba(0, 174, 239, 0.15);
  border-right: 6px solid rgba(0, 174, 239, 0.15);
  border-bottom: 6px solid rgba(0, 174, 239, 0.15);
  border-top: 6px solid rgba(0, 174, 239, 0.8);
  border-radius: 100%;
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
@-moz-keyframes rotation {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotation {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
