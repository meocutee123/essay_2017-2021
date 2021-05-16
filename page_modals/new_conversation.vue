<template>
  <div class="d-flex flex-column">
    <div class="title">
      <h3>New conversation</h3>
    </div>
    <div class="body">
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
            :class="['d-flex align-items-center']"
          >
            <b-img
              rounded="circle"
              src="https://picsum.photos/50/50/?image=41"
              fluid
              alt=""
            />
            <h5 class="font-weight-bold ml-2">
              {{ `${friend.name.firstName} ${friend.name.lastName}` }}
            </h5>
          </div>
        </b-col>
        <b-col
          cols="12"
          class="d-flex justify-content-center align-items-center mt-2"
          ><b-button v-if="!isDisabled" variant="success" @click="close()"
            >Continute
          </b-button>
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
export default {
  data() {
    return {
      values: [],
      friends: [],
      names: [],
      loged_id: null,
      isSelected: true,
      listId: [],
      chatSection: [],
      isLoading: false,
      isDisabled: false
    };
  },
  mounted() {
    this.loged_id = window.localStorage.getItem("loged_id");
    this.listId.push(this.loged_id);
    this.getUsers();
  },
  methods: {
    async newGroup() {},
    async onSelected(index, friend) {
      this.chatSection = []
      const el = document.querySelector(`#user-${index}`);
      const arrIndex = this.listId.findIndex(item => item === friend.id);
      if (el.classList.length == 2) {
        if (arrIndex === -1)
          this.listId.push(friend.id), this.names.push(friend.name.firstName);
        el.classList.add("selected");
        await this.$axios.get("chat-sections.json").then(({ data }) => {
          if (data !== null) {
            for (let [key, value] of Object.entries(data)) {
              const sections = value.users.split(",");
              let difference = sections
                .filter(x => !this.listId.includes(x))
                .concat(this.listId.filter(x => !sections.includes(x)));
              if (difference.length === 0) {
                this.chatSection.push({ ...value, request_id: key });
                break;
              }
            }
          }
        });
      } else {
        el.classList.remove("selected");
        if (index !== -1) {
          this.listId.splice(arrIndex, 1);
          this.names.splice(
            this.names.findIndex(name => name === friend.name.firstName),
            1
          );
        }
      }
    },
    async getUsers() {
      this.isLoading = true;
      await this.$axios.get("users.json").then(response => {
        const users = [];
        for (let [key, value] of Object.entries(response.data)) {
          if (value.id !== this.loged_id) {
            users.push({ ...value, request_id: key });
          }
        }
        this.isLoading = false;
        this.friends = users;
      });
      this.isLoading = false;
    },
    async newConversation() {
      return await this.$axios.post(
        "/chat-sections.json",
        JSON.stringify({
          users: this.listId.join(","),
          name: this.names.join(",")
        })
      );
    },
    async close() {
      this.isDisabled = true;
      if (this.chatSection.length) {
        this.$emit("onCreate", this.chatSection);
        this.$bvModal.hide("newConversation");
        return;
      }
      await this.newConversation().then(response => {
        this.chatSection.push({request_id: response.data.name})
        this.$emit("onCreate", this.chatSection);
      });
      this.$bvModal.hide("newConversation");
      this.isDisabled = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
