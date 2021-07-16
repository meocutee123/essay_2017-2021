<template>
  <div class="d-flex flex-column">
    <div class="title">
      <h3>New conversation</h3>
    </div>
    <div class="body">
      <div class="d-flex align-items-center justify-content-center">
        <label for="search" class="m-0">To: </label>
        <input type="text" v-model="searchTerm" class="search w-100 border-0" />
      </div>
      <div class="d-flex selected-preview">
        <div class="mr-2" v-for="(item, index) in friends" :key="index">
          <span v-if="item.selected">{{ item.family_name }}</span>
        </div>
      </div>
      <h6>Suggested</h6>
      <b-row>
        <b-col v-if="isLoading" cols="6" class="d-flex">
          <b-skeleton width="50px" height="50px" type="avatar"></b-skeleton>
          <div class="d-flex flex-column my-2 ml-2">
            <b-skeleton
              animation="wave"
              height="1rem"
              width="1 50px"
            ></b-skeleton>
            <b-skeleton
              animation="wave"
              height="1rem"
              width="150px"
            ></b-skeleton>
          </div>
        </b-col>
        <b-col v-if="isLoading" cols="6" class="d-flex">
          <b-skeleton width="50px" height="50px" type="avatar"></b-skeleton>
          <div class="d-flex flex-column my-2 ml-2">
            <b-skeleton
              animation="wave"
              height="1rem"
              width="1 50px"
            ></b-skeleton>
            <b-skeleton
              animation="wave"
              height="1rem"
              width="150px"
            ></b-skeleton>
          </div>
        </b-col>
        <b-col v-if="isLoading" cols="6" class="d-flex">
          <b-skeleton width="50px" height="50px" type="avatar"></b-skeleton>
          <div class="d-flex flex-column my-2 ml-2">
            <b-skeleton
              animation="wave"
              height="1rem"
              width="1 50px"
            ></b-skeleton>
            <b-skeleton
              animation="wave"
              height="1rem"
              width="150px"
            ></b-skeleton>
          </div>
        </b-col>
        <b-col v-if="isLoading" cols="6" class="d-flex">
          <b-skeleton width="50px" height="50px" type="avatar"></b-skeleton>
          <div class="d-flex flex-column my-2 ml-2">
            <b-skeleton
              animation="wave"
              height="1rem"
              width="1 50px"
            ></b-skeleton>
            <b-skeleton
              animation="wave"
              height="1rem"
              width="150px"
            ></b-skeleton>
          </div>
        </b-col>
        <b-col
          class="user"
          cols="6"
          v-for="(friend, index) in friends"
          :key="index"
        >
          <div
            :id="`user-${index}`"
            @click="onSelected(index, friend)"
            :class="[
              { selected: friend.selected },
              'd-flex align-items-center mb-2'
            ]"
          >
            <b-img
              style="width: 3rem"
              rounded="circle"
              :src="`${friend.picture}`"
              fluid
              alt=""
            />
            <h5 class="font-weight-bold ml-2">
              {{ `${friend.name}` }}
            </h5>
          </div>
        </b-col>
        <b-col
          cols="12"
          class="d-flex justify-content-center align-items-center mt-2"
          ><button
            class="custom-btn"
            v-if="!isDisabled"
            variant="success"
            @click="close()"
          >
            Continute
          </button>
          <b-icon
            v-else
            icon="arrow-clockwise"
            animation="spin"
            font-scale="2"
          ></b-icon>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  data() {
    return {
      values: [],
      friends: [],
      names: [],
      logged_id: null,
      isSelected: true,
      chatSection: [],
      isLoading: false,
      isDisabled: false,
      searchTerm: ""
    };
  },
  async mounted() {
    this.logged_id = this.$auth.user.email;
    await this.getUsers();
  },
  methods: {
    async newGroup() {},
    async onSelected(index, friend) {
      this.chatSection = [];
      const el = document.querySelector(`#user-${index}`);
      if (el.classList.length == 3) {
        this.friends[index].selected = true;
      } else {
        this.friends[index].selected = false;
      }
      const listId = this.friends
        .filter(item => item.selected == true)
        .map(item => item.email);
      listId.push(this.logged_id);
      firebase
        .database()
        .ref("chat-sections")
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let [key, value] of Object.entries(data)) {
              const sections = value.users;
              let difference = sections
                .filter(x => !listId.includes(x))
                .concat(listId.filter(x => !sections.includes(x)));
              if (difference.length === 0) {
                this.chatSection.push({ ...value, request_id: key });
                break;
              }
            }
          }
        });
    },
    async getUsers() {
      const listFriends = [];
      const users = [];
      firebase
        .database()
        .ref("users")
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
              if (data[key].email === this.logged_id) {
                listFriends.push(data[key].friends);
              } else {
                users.push({ ...data[key], selected: false, request_id: key });
              }
            }
          }
          this.loadUser(listFriends, users);
        });
    },
    loadUser(list, users) {
      const ids = [];
      for (let key in list) {
        for (let j in list[key]) {
          if (list[key][j].status === 1) {
            ids.push(list[key][j].email);
          }
        }
      }
      const temp = [];
      users.forEach(item => {
        if (ids.includes(item.email)) {
          temp.push(item);
        }
      });
      this.values = temp;
      this.search();
    },
    async newConversation() {
      const listUsers = this.friends.filter(item => item.selected === true);
      const users = listUsers.map(item => item.email);
      users.push(this.logged_id);
      let avatars = [this.$auth.user.picture || "https://picsum.photos/200"];

      let test = listUsers.map(item => {
        if (item.picture) {
          return item.picture;
        }
        return "https://picsum.photos/200";
      });
      avatars = avatars.concat(test);
      return new Promise(resolve => {
        firebase
          .database()
          .ref("chat-sections")
          .push({
            users: users,
            name: listUsers.map(item => item.family_name).join(", "),
            avatar: avatars,
            host: this.logged_id,
            options:{
              allow_add: true,
              allow_change: true,
              members: users.length
            }
          })
          .then(({ key }) => resolve(key));
      });
    },
    async close() {
      if (this.friends.filter(item => item.selected === true).length === 0)
        return;
      if (this.chatSection.length) {
        this.$emit("onCreate", this.chatSection);
        this.$bvModal.hide("newConversation");
        return;
      }
      await this.newConversation().then(key => {
        this.chatSection.push({ request_id: key });
        this.$emit("onCreate", this.chatSection);
      });
      this.$bvModal.hide("newConversation");
      this.isDisabled = false;
    },
    search(value = "") {
      if (value === "") {
        this.friends = this.values;
      }
      const result = [];
      this.friends = this.values.map(item => item);
      this.friends.forEach(user => {
        if (user.selected) {
          result.push(user);
          return;
        }
        let fullname = `${user.name}`;
        if (fullname.toLowerCase().includes(value)) {
          result.push(user);
        }
      });
      if (!result.length) {
        return;
      }
      this.friends = result;
    }
  },
  watch: {
    searchTerm: function(value) {
      this.search(value.toLowerCase());
    }
  }
};
</script>

<style lang="scss" scoped>
.selected-preview {
  div span {
    display: inline-block;
    padding: 0 0.3rem;
    border: 1px solid #329a4c;
    border-radius: 0.5rem;
  }
}
h3 {
  font-weight: bolder;
}
.user {
  border-radius: 1rem;

  box-sizing: border-box;
  div {
    padding: 0.5rem;
    width: 100%;
    background: rgb(245, 245, 245);
    border-radius: 1rem;
    height: 65px;
    cursor: pointer;
    h5 {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.selected {
  background-color: #8bdfb9 !important;
}
.speech-bubble {
  position: relative;
  background: #329a4c;
  border-radius: 1rem;
  max-width: 200px;
  padding: 0.5rem;
}

.speech-bubble:after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 0.063em solid transparent;
  border-left-color: #329a4c;
  border-right: 0;
  border-bottom: 0;
  margin-top: -0.031em;
  margin-right: -0.062em;
}
.search {
  border-bottom: 1px solid #273849;
  padding: 0.3rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border: none;
  }
}
.custom-btn {
  outline: none;
  border: none;
  padding: 5px 8px;
  border-radius: 1rem;
  background: #329a4c;
  color: #000;
  font-weight: bold;
}
</style>
