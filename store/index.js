export const state = () => ({
  messages: [],
  chatSections: []
});
export const getters = {};
export const actions = {
  async getMessages({ commit }) {
    await this.$axios
      .get("/messages.json")
      .then(response => {
        const data = [];
        for (let index in response.data) {
          data.push({ id: index, ...response.data[index] });
        }
        commit("setMessages", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  updateMessage({ commit }, payload) {
    commit("updateMessage", payload);
  },
  async deleteMessage({ commit }, id) {
    await this.$axios
      .delete(`/messages/${id}.json`)
      .then(res => {
        commit("deleteMessage", id);
      })
      .catch(err => console.log(err));
  },
  async getChatSection({ commit }) {
    await this.$axios.get("chat-sections.json").then(response => {
      const payload = [];
      for (let index in response.data) {
        if (response.data[index].users.includes(localStorage.getItem("loged-id"))) {
          payload.push({ ...response.data[index], id: index });
        }
        continue;
      }
      commit("setChatSection", payload);
    });
  }
};
export const mutations = {
  updateMessage(state, payload) {
    state.messages.push(payload);
  },
  setMessages(state, payload) {
    state.messages = payload;
  },
  deleteMessage(state, payload) {
    state.messages.splice(
      state.messages.findIndex(i => i.id === payload),
      1
    );
  },
  setChatSection(state, payload) {
    state.chatSections = payload;
    console.log(state.chatSections);
  }
};
