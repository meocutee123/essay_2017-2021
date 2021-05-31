<template>
  <div class="handler d-flex flex-column">
    <h3 class="font-weight-bold">Notifications</h3>
    <div class="d-flex flex-column">
      <h4 v-if="pendingAcept.length" class="font-weight-bold">Today</h4>
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
      <h4 v-if="pendingYesterday.length" class="font-weight-bold">Yesterday</h4>
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
            <b-button
              v-b-toggle="`collapse-yd-${index}`"
              class="btn-light-grey"
            >
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
          <b-collapse :id="`collapse-yd-${index}`" class="collapse-btn mb-2">
            <button class="mr-3" @click="accept(user, 'yesterday', index)">
              Accept
            </button>
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
      logged_id: null,
      isLoading: false,
      pendingYesterday: [],
      currentUserRequestId: null,
      currentUserId: null
    };
  },
  async mounted() {
    this.isLoading = true;
    this.logged_id = window.localStorage.getItem("logged_id");
    const baseUser = [];
    const users = [];

    const request_id = await this.$axios.get(`users.json`, { progress: false }).then(response => {
      let temp;
      for (let i in response.data) {
        if (response.data[i].id !== this.logged_id) {
          users.push({ ...response.data[i], request_id: i });
        } else {
          temp = i;
          baseUser.push(response.data[i]);
        }
      }
      return temp;
    });
    this.currentUserRequestId = request_id;
    this.currentUserId = baseUser[0].id;
    const today = [];
    const yesterday = [];
    for (let index in baseUser[0].requests) {
      let temp = users.filter(
        user => user.id === baseUser[0].requests[index].request_from
      );
      today.push({ ...temp[0], delete_id: index });
    }

    this.isLoading = false;
    this.pendingAcept = today;
    this.pendingYesterday = yesterday;
    this.isLoading = false;
  },
  methods: {
    async accept(user, from, index) {
      await this.$axios.post(`users/${user.request_id}/friends.json`, {
        uid: this.currentUserId
      });
      await this.$axios
        .post(`users/${this.currentUserRequestId}/friends.json`, {
          uid: user.id
        })
        .then(res => {
          from === "today" && this.pendingAcept.splice(index, 1);
          from === "yesterday" && this.pendingYesterday.splice(index, 1);
        });
      this.$axios.delete(
        `users/${this.currentUserRequestId}/requests/${user.delete_id}.json`
      );
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
