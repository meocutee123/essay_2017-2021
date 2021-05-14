<template>
  <page-container>
    <template v-slot:sidebar>
      <div class="side-header d-flex">
        <span>Chats</span>
        <div class="ml-auto new-chat">
          <button class="btn-light-grey">
            <b-icon icon="three-dots" aria-hidden="true"></b-icon>
          </button>

          <button class="btn-light-grey" v-b-modal.newConversation>
            <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
          </button>
          <b-modal id="newConversation" hide-footer hide-header>
            <new_conversation />
          </b-modal>
        </div>
      </div>
      <div class="chats d-flex flex-column">
        <div
          v-for="chat in chatSections"
          :key="chat.id"
          @click="openChatSection(chat.id)"
          class="user d-flex"
        >
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
    <Default v-if="!chatSections.length" />
    <ChatSection v-else ref="chatSection" :sectionData="sectionData" />
    <!-- <Playground @onClickSend="sendMessage" /> -->
  </page-container>
</template>

<script>
import new_conversation from "../page_modals/new_conversation.vue";
export default {
  components: { new_conversation },
  data() {
    return {
      isActive: false,
      onFocus: false,
      email: "",
      password: "",
      isDefaultView: true,
      chatSections: [],
      sectionData: {},
      loged_id: null
    };
  },
  async mounted() {
    this.loged_id = window.localStorage.getItem("loged_id");
    await this.getData();
    this.chatSections.length && this.openChatSection(this.chatSections[0].id);
  },
  methods: {
    async getData() {
      await this.$axios.get("chat-sections.json").then(response => {
        const payload = [];
        for (let index in response.data) {
          if (response.data[index].users.includes(this.loged_id)) {
            payload.push({ ...response.data[index], id: index });
          }
          continue;
        }
        this.chatSections = payload;
      });
    },
    async openChatSection(id) {
      this.isDefaultView = false;
      await this.$axios
        .get(`/chat-sections/${id}.json`)
        .then(response => {
          this.sectionData = Object.assign({}, response.data, { id: id });
          this.$refs.chatSection.isActive = false;
          this.$refs.chatSection.getData();
        })
        .catch(err => {
          console.log(err);
        });
    },
    async sendMessage(content) {
      await this.$axios
        .post("messages.json", JSON.stringify(content))
        .then(response => {})
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
</style>
