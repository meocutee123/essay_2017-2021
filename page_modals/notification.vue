<template>
  <div class="handler d-flex flex-column">
    <h3 class="font-weight-bold">Notifications</h3>
    <div class="d-flex flex-column">
      <h4 class="font-weight-bold">Today</h4>
      <div v-if="isLoading" class="content d-flex my-3">
        <b-skeleton width="57px" height="50px" type="avatar"></b-skeleton>
        <div style="width: 70%" class="ml-3 mt-1">
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
        <b-button class="btn-light-grey">
          <b-icon icon="three-dots"></b-icon>
        </b-button>
      </div>
      <div v-if="isLoading" class="content d-flex my-3">
        <b-skeleton width="57px" height="50px" type="avatar"></b-skeleton>
        <div style="width: 70%" class="ml-3 mt-1">
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
        <b-button class="btn-light-grey">
          <b-icon icon="three-dots"></b-icon>
        </b-button>
      </div>
      <div v-if="isLoading" class="content d-flex my-3">
        <b-skeleton width="57px" height="50px" type="avatar"></b-skeleton>
        <div style="width: 70%" class="ml-3 mt-1">
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
        <b-button class="btn-light-grey">
          <b-icon icon="three-dots"></b-icon>
        </b-button>
      </div>

      <div
        class="content d-flex"
        v-for="(user, index) in pendingAcept"
        :key="index"
      >
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">{{
                `${user.name.firstName} ${user.name.lastName}`
              }}</span>
              sent you a friend request.
            </p>
            <b-button v-b-toggle="`collapse-${index}`" class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
          <b-collapse :id="`collapse-${index}`" class="collapse-btn mb-2">
            <button class="mr-3" @click="accept(user, 'today', index)">
              Accept
            </button>
            <button @click="reject()">Reject</button>
          </b-collapse>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column">
      <h4 class="font-weight-bold">Yesterday</h4>
      <div v-if="isLoading" class="content d-flex my-3">
        <b-skeleton width="57px" height="50px" type="avatar"></b-skeleton>
        <div style="width: 70%" class="ml-3 mt-1">
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
        <b-button class="btn-light-grey">
          <b-icon icon="three-dots"></b-icon>
        </b-button>
      </div>
      <div v-if="isLoading" class="content d-flex my-3">
        <b-skeleton width="57px" height="50px" type="avatar"></b-skeleton>
        <div style="width: 70%" class="ml-3 mt-1">
          <b-skeleton animation="wave" width="100%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
        <b-button class="btn-light-grey">
          <b-icon icon="three-dots"></b-icon>
        </b-button>
      </div>
      <div
        class="content d-flex"
        v-for="(user, index) in pendingYesterday"
        :key="index"
      >
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">{{
                `${user.name.firstName} ${user.name.lastName}`
              }}</span>
              sent you a friend request.
            </p>
            <b-button v-b-toggle="`collapse-yd${index}`" class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
          <b-collapse :id="`collapse-yd-${index}`" class="collapse-btn mb-2">
            <button class="mr-3">Accept</button>
            <button>Reject</button>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pendingAcept: [],
      loged_id: null,
      isLoading: false,
      pendingYesterday: []
    };
  },
  async mounted() {
    this.isLoading = true;
    this.loged_id = window.localStorage.getItem("loged_id");
    const users = [];
    const request_id = await this.$axios.get(`users.json`).then(response => {
      for (let i in response.data) {
        users.push(response.data[i]);
      }
      return Object.entries(response.data).filter(
        item => item[1].id === this.loged_id
      )[0][0];
    });
    await this.$axios
      .get(`users/${request_id}/requests.json`)
      .then(({ data }) => {
        const listId = [];
        for (let i in data) {
          if (data[i].status != 1) {
            listId.push(data[i].request_from);
          }
        }
        const today = [];
        const yesterday = [];
        for (const id of listId) {
          let temp = users.filter(user => user.id === id);
          let { requests } = { ...temp[0] };
          for (let i in requests) {
            if (requests[i].time === new Date().toLocaleDateString("en-GB")) {
              today.push({ ...temp[0], request_id: request_id });
            } else {
              yesterday.push({ ...temp[0], request_id: request_id });
            }
          }
        }
        this.isLoading = false;
        this.pendingAcept = today;
        this.pendingYesterday = yesterday;
      });
    this.isLoading = false;
  },
  methods: {
    async accept(user, from, index) {
      await this.$axios
        .post(`users/${user.request_id}/friends.json`, { uid: user.id })
        .then(res => {
          from === "today" && this.pendingAcept.splice(index, 1);
          from === "yesterday" && this.pendingYesterday.splice(index, 1);
        });
      let idRequest = Object.keys(user.requests).find(
        key => user.requests[key].request_from === user.id
      );
      this.$axios.patch(`users/${user.request_id}/requests/${idRequest}.json`, {
        status: 1
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.handler {
  height: calc(500px - 0.8 * 17px * 2);
}
.collapse-btn {
  button {
    background-color: #e4e6eb;
    outline: none;
    border: none;
    position: relative;
    padding: 0.2em 0.3em;
    border-radius: 0.8em;
  }
}
</style>
