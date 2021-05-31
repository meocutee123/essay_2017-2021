import firebase from "firebase/app";
import "firebase/auth";
export const state = () => ({
  logged_infor: null,
  messages: [],
  chatSections: []
});
export const getters = {
  isAuthenticated(state) {
    return localStorage.getItem("logged_id");
  }
};
export const actions = {
  async onSubmit({ commit }, { email, password, vm }) {
    return await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        commit("setAuthorize", response.user);
        return response;
      })
      .catch(err => {
        vm.$root.$bvToast.toast("Username or password is incorrect!", {
          title: "Error!",
          variant: "danger",
          solid: true
        });
      });
  },
  async onCreateUser({ commit }, { email, password, name, vm }) {
    const { isConfirmed } = await vm.$swal.fire({
      title: "Terms and conditions",
      input: "checkbox",
      inputValue: 1,
      inputPlaceholder: "I agree with the terms and conditions",
      confirmButtonText: 'Continue&nbsp;<i class="fa fa-arrow-right"></i>',
      inputValidator: result => {
        return !result && "You need to agree with T&C";
      }
    });
    if (isConfirmed) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          vm.$bvToast.toast("Account created successfully!", {
            title: "Success",
            variant: "success",
            solid: true
          });
          vm.$axios.post("users.json", {
            email: email,
            password: password,
            id: response.user.uid,
            name: {
              firstName: name.firstName,
              lastName: name.lastName
            }
          });
          return true;
        })
        .catch(err => {
          vm.$bvToast.toast(err.message, {
            title: "Error",
            variant: "danger",
            solid: true
          });
        });
    }
  }
};
export const mutations = {
  setAuthorize(state, payload) {
    state.logged_infor = true;
    window.localStorage.setItem("logged_id", payload.uid);
  }
};
