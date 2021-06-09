<template>
  <div class="handler d-flex flex-column">
    <h3 class="font-weight-bold">Notifications</h3>
    <div class="d-flex flex-column">
      <h4 v-if="pendingAccept.length" class="font-weight-bold">Today</h4>
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
        v-for="(user, index) in pendingAccept"
        :key="index"
      >
        <b-avatar size="3rem" :src="`${user.picture}`"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">{{ `${user.name}` }}</span>
              sent you a friend request.
            </p>
            <b-button v-b-toggle="`collapse-${index}`" class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
          <b-collapse :id="`collapse-${index}`" class="collapse-btn mb-2">
            <button class="mr-3" @click="accept(user)">
              Accept
            </button>
            <button @click="reject(user)">Reject</button>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  props: ["user"],
  data() {
    return {
      pendingAccept: [],
      logged_id: null,
      isLoading: false
    };
  },
  async mounted() {
    this.logged_id = this.$auth.user.email
    this.getData();
  },
  methods: {
    getData() {
      this.isLoading = true;
      firebase
        .database()
        .ref("users/" + this.user.request_id + "/friends")
        .on("value", snapshot => {
          const pendingAccept = [];
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
              if (data[key].status === 0 && data[key].from != this.logged_id) {
                pendingAccept.push({ ...data[key], data_request: key });
              }
            }
            this.isLoading = false;
            this.pendingAccept = pendingAccept;
            console.log(pendingAccept);
          } else {
            this.isLoading = false;
            this.pendingAccept = [];
          }
        });
    },
    accept(user) {
      firebase
        .database()
        .ref("users/" + this.user.request_id + "/friends/" + user.data_request)
        .update({
          status: 1
        });
      firebase
        .database()
        .ref("users/" + user.request_id + "/friends/" + user.data_request)
        .update({
          status: 1
        });
    },
    reject(user) {
      firebase
        .database()
        .ref("users/" + this.user.request_id + "/friends/" + user.data_request)
        .remove();
      firebase
        .database()
        .ref("users/" + user.request_id + "/friends/" + user.data_request)
        .remove();
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
