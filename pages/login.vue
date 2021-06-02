<template>
  <div class="p-2" style="display: grid; place-items: center; height: 100vh">
    <div @click="login()">Login with Google</div>
    {{ users }}
    <div class="ml-auto login-form">
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
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  layout: "empty",
  data() {
    return {
      users: [],
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
  mounted() {
    this.getRealtimeUpdate();
  },
  methods: {
    async login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;
          this.onSave(result.additionalUserInfo.profile);
          this.$router.push("/");
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
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
    async onSave(profile) {
      window.localStorage.setItem("uif", JSON.stringify(profile));
      const db = firebase.firestore();
      const usersRef = db.collection("users");
      usersRef.doc(profile.email).set(profile);

      this.users = await usersRef.get().then(doc => {
        if (doc && doc.exists) {
          return doc.docs.map(item => item.data());
        }
      });
    },
    getRealtimeUpdate() {
      firebase
        .firestore()
        .collection("users")
        .onSnapshot(doc => {
          console.log(doc);
        });
    },
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
      this.isSignUp
        ? this.doSignUp()
        : await this.$store
            .dispatch("onSubmit", { ...this.form, vm: this })
            .then(response => {
              if (response) {
                this.$axios
                  .post("login-users.json", {
                    user: response.user.uid
                  })
                  .then(() => {
                    this.$router.push("/");
                  });
              }
            });
    },
    async doSignUp() {
      await this.$store.dispatch("onCreateUser", { ...this.form, vm: this });
    }
  }
};
</script>

<style lang="scss" scoped></style>
