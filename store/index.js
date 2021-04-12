export const state = () => ({
  messages: []
});
export const getters = {};
export const actions = {
  async getMessages() {
    await this.$axios
      .get("/messages.json")
      .then(response => {
          console.log(response);
        this.messages = response.date;
      })
      .catch(err => {
        console.log(err);
      });
  },
  updateMessage({ commit }, payload) {
    commit("updateMessage", payload);
  }
};
export const mutations = {
  updateMessage(state, payload) {
    state.messages.push(payload);
  }
};
