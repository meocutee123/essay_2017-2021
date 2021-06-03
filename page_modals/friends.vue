<template>
  <div>
    <h3 style="font-size: 1.70rem" class="font-weight-bold">
      People you might know
    </h3>
    <div class="d-flex search justify-content-start align-items-center">
      <label class="m-0 mr-2" for="search">Find: </label>
      <input id="search" type="text" />
    </div>
    <h5 class="font-weight-bold">Suggested</h5>
    <div v-if="isLoading" class="friends d-flex my-3">
      <b-skeleton width="90px" height="70px" type="avatar"></b-skeleton>
      <div style="width: 80%" class="ml-3 mt-2">
        <b-skeleton animation="wave" width="90%"></b-skeleton>
        <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
      </div>
      <b-skeleton-icon
        icon="person"
        :icon-props="{ fontScale: 1.7 }"
      ></b-skeleton-icon>
    </div>
    <div v-if="isLoading" class="friends d-flex my-3">
      <b-skeleton width="90px" height="70px" type="avatar"></b-skeleton>
      <div style="width: 80%" class="ml-3 mt-2">
        <b-skeleton animation="wave" width="90%"></b-skeleton>
        <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
      </div>
      <b-skeleton-icon
        icon="person"
        :icon-props="{ fontScale: 1.7 }"
      ></b-skeleton-icon>
    </div>
    <div v-if="isLoading" class="friends d-flex my-3">
      <b-skeleton width="90px" height="70px" type="avatar"></b-skeleton>
      <div style="width: 80%" class="ml-3 mt-2">
        <b-skeleton animation="wave" width="90%"></b-skeleton>
        <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
      </div>
      <b-skeleton-icon
        icon="person"
        :icon-props="{ fontScale: 1.7 }"
      ></b-skeleton-icon>
    </div>
    <div class="friends">
      <div
        class="friend d-flex p-2"
        v-for="(person, index) in people"
        :key="index"
      >
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder mb-0">
            {{ person.name.firstName }} {{ person.name.lastName }}
          </h4>
          <small
            class="text-success"
            :id="`person-${index}`"
            >{{ person.pending && "(Pending accept)"}}</small
          >
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
        <b-icon
          v-if="!person.pending"
          class="mt-1"
          :id="`icon-${index}`"
          style="color: #41b883"
          icon="person-plus-fill"
          scale="1.5rem"
          @click="sendRequest(person.request_id, index)"
        ></b-icon>
      </div>
    </div>
    <h5 class="font-weight-bold">Friends</h5>
    <div class="friends">
      <div
        class="friend d-flex p-2"
        v-for="(person, index) in friends"
        :key="index"
      >
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">
            {{ person.name.firstName }} {{ person.name.lastName }}
          </h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
        <b-icon
          class="mt-1"
          style="color: red"
          :icon="'person-x-fill'"
          scale="1.5rem"
          @click="removeFriend(person.request_id, person.id)"
        ></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      friends: [],
      people: [],
      isRequested: {},
      users: null,
      logged_id: null,
      isLoading: false,
      currentUser: []
    };
  },
  async mounted() {
    this.logged_id = window.localStorage.getItem("logged_id");
    this.isLoading = true;
    await this.$axios.get("users.json", { progress: false }).then(response => {
      const users = [];
      for (const [key, value] of Object.entries(response.data)) {
        if (value.email === this.logged_id) {
          this.currentUser.push({ ...value, request_id: key });
        } else {
          users.push({ ...value, request_id: key });
        }
      }
      this.isLoading = false;
      this.users = users;
    });
    this.getFriends();
    this.isLoading = false;
  },
  methods: {
    getFriends() {
      const currentUser = this.currentUser[0];
      const listRequestID = [];
      if (currentUser.requests) {
        for (let i in currentUser.requests) {
          listRequestID.push(
            currentUser.requests[i].request_from
          );
        }
      }
      const listFriendsId = [];
      this.friends = this.currentUser.filter(
        item =>
          item.friends &&
          Object.entries(item.friends).map(item => {
            listFriendsId.push(item[1].uid);
          })
      );
      const listFriends = [];
      this.users.map(item => {
        listFriendsId.includes(item.email)
          ? listFriends.push(item)
          : this.handleSuggested(listRequestID, item);
      });
      this.friends = listFriends;
    },
    handleSuggested(ids, item) {
      if (ids.includes(item.id)) {
        this.people.push({ ...item, pending: true });
        return;
      }
      this.people.push(item);
    },
    async sendRequest(request_id, index) {
      let person = this.$el.querySelector(`#person-${index}`);
      let icon = this.$el.querySelector(`#icon-${index}`);
      if (person) {
        person.innerHTML = "(Pending accept)";
      }

      if (icon) {
        icon.setAttribute("style", "display: none");
      }
      await this.$axios
        .post(`users/${request_id}/requests.json`, {
          request_from: this.logged_id,
          type: "create",
          status: 0,
          time: new Date().toLocaleDateString("en-GB")
        }, { progress: false })
        .then(res => {});
    },
    removeFriend(req, id) {
      const user = this.users.find(user => user.id === id);
      let fWR;
      for (let i in user.friends) {
        if (user.friends[i].uid === this.logged_id) {
          fWR = i;
        }
      }
      this.$axios.delete(`users/${req}/friends/${fWR}.json`); //delete jisoo from rose
      let fOM;
      for (let i in this.currentUser[0].friends) {
        if (this.currentUser[0].friends[i].uid === id) {
          fOM = i;
        }
      }
      this.$axios.delete(
        `users/${this.currentUser[0].request_id}/friends/${fOM}.json`
      ); //user
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 0.8em;
  input {
    outline: none;
    border: none;
    border-bottom: 1px solid #e4e6eb;
    margin: 0;
    width: 100%;
  }
}
.friends {
  .friend {
    padding: 0.3em;
    border-radius: 0.7em;
    transition: 0.5s;
    &:hover {
      background-color: #fff7f6;
    }
    .b-icon:hover {
      cursor: pointer;
    }
    div > p {
      font-size: 0.7em;
      color: #d8dbe0;
    }
  }
}
</style>
