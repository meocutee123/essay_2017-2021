import firebase from "firebase/app";
import "firebase/auth";
export const state = () => ({});
export const getters = {
    getLS(){
        return window.localStorage.getItem('logged_id')
    }
};
export const actions = {
  setLS({ commit }, payload) {
    window.localStorage.setItem("logged_id", payload);
  }
};
export const mutations = {};
