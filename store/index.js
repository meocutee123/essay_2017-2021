import firebase from "firebase/app";
import "firebase/auth";
export const state = () => ({
  loged_infor: {
    state: false,
    loged_id: null
  },
  messages: [],
  chatSections: []
});
export const getters = {};
export const actions = {
  async onSubmit({ commit }, { email, password, vm }) {
    return await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        commit("setAuthorize", response.user);
        return true
      })
      .catch((err) => {
        vm.$root.$bvToast.toast("Username or password is incorrect!", {
          title: "Error!",
          variant: "danger",
          solid: true
        });
      });
  },
  async onCreateUser({ commit }, { email, password, name, vm }) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        vm.$bvToast.toast("Account created successfully!", {
          title: "Success",
          variant: "success",
          solid: true
        });
        this.$axios.post("users.json", {
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
        this.$bvToast.toast(err.message, {
          title: "Error",
          variant: "danger",
          solid: true
        });
      });
  }
};
export const mutations = {
  setAuthorize(state, payload) {
    state.loged_infor = true;
    window.localStorage.setItem('loged_id', payload.uid)
  }
};
