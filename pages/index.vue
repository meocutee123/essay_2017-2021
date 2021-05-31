<template>
  <client-only>
    <page-container>
      <template v-slot:sidebar>
        <div class="side-header d-flex">
          <span>Chats</span>
          <div class="ml-auto new-chat">
            <button class="btn-light-grey">
              <b-icon icon="three-dots" aria-hidden="true"></b-icon>
            </button>

            <button class="btn-light-grey" v-b-modal="'newConversation'">
              <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
            </button>
            <b-modal id="newConversation" hide-footer hide-header>
              <new_conversation
                :sectionData="sectionData"
                @onCreate="onCreate"
              />
            </b-modal>
          </div>
        </div>

        <div class="chats d-flex flex-column">
          <div v-if="isLoadingSection" class="user d-flex my-3 ml-2">
            <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
            <div style="width: 80%" class="ml-3 mt-2">
              <b-skeleton animation="wave" width="90%"></b-skeleton>
              <b-skeleton
                animation="wave"
                class="mt-2"
                width="55%"
              ></b-skeleton>
            </div>
          </div>
          <div v-if="isLoadingSection" class="user d-flex my-3 ml-2">
            <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
            <div style="width: 80%" class="ml-3 mt-2">
              <b-skeleton animation="wave" width="90%"></b-skeleton>
              <b-skeleton
                animation="wave"
                class="mt-2"
                width="55%"
              ></b-skeleton>
            </div>
          </div>

          <div
            v-for="(chat, index) in chatSections"
            :key="index"
            @click="openChatSection(chat.id)"
            :class="[{ onActive: chat.isActive }, 'user d-flex']"
          >
            <div :ref="`section-${index}`"></div>
            <b-avatar size="3.3rem" src="/nayeon.jpg"></b-avatar>
            <span
              >{{ chat.name }}
              <p class="active">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
                accusamus cum non.
              </p>
            </span>
            <div class="unread">
              <b-icon
                icon="circle-fill"
                style="color: #fec5bb"
                scale=".8rem"
              ></b-icon>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:friends>
        <div class="side-header d-flex">
          <span>Online friends</span>
        </div>

        <div class="chats d-flex flex-column ???">
          <div v-if="isLoading" class="user d-flex my-3 ml-2">
            <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
            <div style="width: 80%" class="ml-3 mt-2">
              <b-skeleton animation="wave" width="90%"></b-skeleton>
              <b-skeleton
                animation="wave"
                class="mt-2"
                width="55%"
              ></b-skeleton>
            </div>
          </div>
          <div v-if="isLoading" class="user d-flex my-3 ml-2">
            <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
            <div style="width: 80%" class="ml-3 mt-2">
              <b-skeleton animation="wave" width="90%"></b-skeleton>
              <b-skeleton
                animation="wave"
                class="mt-2"
                width="55%"
              ></b-skeleton>
            </div>
          </div>
          <div
            v-for="(friend, index) in friends"
            :key="index"
            class="user d-flex my-1 ml-2 align-items-center"
          >
            <b-avatar width="65px" height="60px"></b-avatar>
            <div style="width: 80%" class="ml-3 mt-2">
              <h4 class="font-weight-bold">
                {{ `${friend.name.firstName} ${friend.name.lastName}` }}
              </h4>
              <small class="text-success">Online</small>
            </div>
          </div>
        </div>
      </template>
      <ChatSection
        v-if="!isDefaultView"
        ref="chatSection"
        :sectionData="sectionData"
      />
      <Default v-else />
    </page-container>
  </client-only>
</template>

<script>
import new_conversation from "../page_modals/new_conversation.vue";
export default {
  loading: false,
  middleware: "auth",
  components: { new_conversation },
  data() {
    return {
      onFocus: false,
      email: "",
      password: "",
      isDefaultView: true,
      chatSections: [],
      sectionData: {},
      logged_id: null,
      isLoading: false,
      friends: [],
      isLoadingSection: false
    };
  },
  created() {
    this.$nuxt.$on("loadOnSearch", payload => {
      this.openChatSection(payload);
    });
  },
  async mounted() {
    this.logged_id = window.localStorage.getItem("logged_id");
    this.getFriends();
    await this.getData();
  },
  methods: {
    async onCreate(payload) {
      await this.getData();
      const index = this.chatSections.findIndex(
        section => section.id === payload[0].request_id
      );
      const el = this.$refs[`section-${index}`][0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      if (payload) {
        await this.openChatSection(payload[0].request_id);
      }
    },
    async getFriends() {
      this.isLoading = true;
      const listID = [];
      await this.$axios
        .get("login-users.json", { progress: false })
        .then(response => {
          for (let [key, value] of Object.entries(response.data)) {
            if (value.user !== this.logged_id) {
              listID.push({ ...value, request_id: key });
            }
          }
        });
      let onlines = [];
      await this.$axios
        .get("users.json", { progress: false })
        .then(response => {
          for (let [key, value] of Object.entries(response.data)) {
            if (value.id !== this.logged_id) {
              onlines.push({ ...value, request_id: key });
            }
          }
        });
      const test = [];
      listID.forEach(item => {
        onlines.forEach(user => {
          if (item.user === user.id) {
            test.push(user);
          }
        });
      });
      this.isLoading = false;
      this.friends = test;
      //  console.log("wtf??", onlineFriends);
    },
    async getData() {
      this.isLoadingSection = true;
      await this.$axios
        .get("chat-sections.json", { progress: false })
        .then(response => {
          const payload = [];
          for (let index in response.data) {
            if (response.data[index].users.includes(this.logged_id)) {
              payload.push({ ...response.data[index], id: index });
            }
            continue;
          }
          this.isLoadingSection = false;
          this.chatSections = payload;
        })
        .catch(() => {
          this.isLoadingSection = false;
        });
    },
    async openChatSection(id) {
      this.isDefaultView = false;

      this.chatSections.forEach(item => {
        if (item.id === id) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      setTimeout(() => {
        const el = this.$el.getElementsByClassName("onActive")[0];
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
      await this.$axios
        .get(`/chat-sections/${id}.json`, { progress: false })
        .then(response => {
          this.sectionData = Object.assign({}, response.data, { id: id });
          this.$refs.chatSection.isActive = false;
          this.$refs.chatSection.getData();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.side-header {
  padding: 1rem 0.3em;
  height: 60px;
  background-color: #ffffff;
  span {
    font-weight: bolder;
    font-size: 1.5rem;
  }
}
.chats {
  box-sizing: border-box;
  overflow: scroll;
  border-top: 1px solid rgb(211, 211, 211);
  height: 100%;
  .user {
    margin: 0.5rem;
    padding: 1em 1em;
    transition: 0.5s;
    border-radius: 1rem;
    position: relative;
    &:hover {
      cursor: pointer;
      background-color: #d3d6df;
    }
    .unread {
      position: absolute;
      right: 10px;
    }
    span {
      margin-right: 1em;
      font-size: 1.1rem;
      font-weight: bold;
      p {
        font-size: 0.8rem;
        text-overflow: ellipsis;
        max-width: 150px;
        overflow: hidden;
        height: 1.2em;
        white-space: nowrap;
      }
      .active {
        color: #273849;
        font-weight: bold;
      }
    }
  }
}

.btn-light-grey {
  color: #111111;
  font-weight: bold;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
}
.onActive {
  background-color: #c6e3ff;
}
</style>
