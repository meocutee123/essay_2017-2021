<template>
  <div class="side-bar">
    <div class="side-header d-flex my-2 flex-column">
      <div class="mb-2 d-flex">
        <h4 class="ml-2 font-weight-bold">Chats</h4>
        <button class="ml-auto btn-light-grey">
          <b-icon icon="three-dots" aria-hidden="true"></b-icon>
        </button>

        <button class="btn-light-grey" v-b-modal="'newConversation'">
          <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
        </button>
        <b-modal id="newConversation" hide-footer hide-header>
          <new_conversation @onCreate="onCreate" />
        </b-modal>
      </div>
      <div style="position: relative" class="d-flex align-items-center px-2">
        <b-icon icon="search" class="icon-search"></b-icon>
        <input
          type="text"
          placeholder="Search Messenger"
          class="search-chats w-100"
          @input="test($event.target.value)"
        />
      </div>
    </div>
    <div class="side-content">
      <div v-if="isLoadingSection" class="user d-flex my-3 ml-2">
        <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
        <div style="width: 80%" class="ml-3 mt-2">
          <b-skeleton animation="wave" width="90%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
      </div>
      <div v-if="isLoadingSection" class="user d-flex my-3 ml-2">
        <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
        <div style="width: 80%" class="ml-3 mt-2">
          <b-skeleton animation="wave" width="90%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
      </div>
      <div v-if="isLoadingSection" class="user d-flex my-3 ml-2">
        <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
        <div style="width: 80%" class="ml-3 mt-2">
          <b-skeleton animation="wave" width="90%"></b-skeleton>
          <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
        </div>
      </div>
      <div
        v-for="(chat, index) in chatSections"
        :key="index"
        :id="`section-${index}`"
        @click="openChatSection(chat.id)"
        :class="['user d-flex align-items-center']"
      >
        <div :ref="`section-${index}`"></div>
        <b-avatar-group size="3rem" style="position: relative">
          <b-avatar
            v-for="(avt, index02) in chat.avatar.slice(0, 2)"
            :key="index02"
            :src="`${avt}`"
          ></b-avatar>
          <span class="numbers">{{
            chat.avatar.length == 2 ? "" : "+ " + (chat.avatar.length - 2)
          }}</span>
        </b-avatar-group>
        <div>
          <h4 class="mb-0">
            {{ chat.name }}
          </h4>
          <small :class="[{ unseen: isSeen(chat.seen) }]">
            {{ getMessage(chat, index) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase/app";
import new_conversation from "../page_modals/new_conversation.vue";

export default {
  data() {
    return {
      tabIndex: 0,
      chatSections: [],
      isLoadingSection: false,
      seenList: []
    };
  },
  components: {
    new_conversation
  },
  created() {
    this.$nuxt.$on("loadOnSearch", payload => {
      this.openChatSection(payload);
    });
  },
  async mounted() {
    this.logged_id = this.$auth.user.email;
    await this.getData();
  },
  methods: {
    test(searchText = ""){
      if(!searchText.length) this.getData()
      const regex = new RegExp(`${searchText}`, "g");
      this.chatSections = this.chatSections.filter(item => {
        return item.name.toLowerCase().match(regex)
      })
    },
    async getData() {
      this.isLoadingSection = true;
      firebase
        .database()
        .ref("chat-sections/")
        .on("value", snapshot => {
          if (snapshot.exists()) {
            let payload = [];
            const data = snapshot.val();
            for (let index in data) {
              if (data[index].users.includes(this.logged_id)) {
                payload.push({ ...data[index], id: index });
              }
            }
            this.isLoadingSection = false;
            this.chatSections = payload.reverse();
          } else {
            this.chatSections = [];
            this.isLoadingSection = false;
          }
        });
    },
    onCreate(payload) {
      this.openChatSection(payload[0].request_id);
      const index = this.chatSections.findIndex(
        section => section.id === payload[0].request_id
      );
      const el = this.$refs[`section-${index}`][0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    async openChatSection(id) {
      this.isDefaultView = false;
      this.chatSections.forEach((item, index) => {
        if (item.id === id) {
          document.getElementById(`section-${index}`).classList.add("onActive");
        } else {
          document
            .getElementById(`section-${index}`)
            .classList.remove("onActive");
        }
      });
      firebase
        .database()
        .ref(`/chat-sections/${id}`)
        .update({
          seen: [...this.seenList, this.logged_id]
        });
      firebase
        .database()
        .ref(`/chat-sections/${id}`)
        .once("value")
        .then(snapshot => {
          this.$emit(
            "openChatSection",
            Object.assign({}, snapshot.val(), { id: id })
          );
        });
    },
    getMessage(chat, index) {
      if (chat.messages) {
        let data = [];
        for (let [key, value] of Object.entries(chat.messages)) {
          data.push({ ...value });
        }
        const lastItem = data[data.length - 1];
        if (lastItem.status === 0) {
          if (this.logged_id === lastItem.user) {
            return "You unsent a message.";
          }
          return `${lastItem.name} unsent a message.`;
        }
        const result = lastItem.message;
        if (Array.isArray(result)) {
          return chat.sender + " sent " + result.length + " photo(s).";
        }
        return chat.sender + ": " + (result.text || result) + ".";
      }
    },
    isSeen(list = []) {
      if (list.includes(this.logged_id)) {
        return false;
      }
      this.seenList = list;
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.side-bar {
  height: 90vh;
  .side-content {
    border-right: 1px solid #e4e6eb;
    height: calc(100% - 77.78px - 16px);
    width: 100%;
    overflow-y: scroll;
    box-sizing: border-box;
    .user {
      margin: 0.5rem;
      padding: 1em 0em 1em 0.5em;
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
      div {
        h4 {
          align-self: center;
          margin-left: 2.2rem;
          font-weight: bold;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        small {
          display: inline-block;
          margin-left: 2.2rem;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.chats {
  height: 490px;
  overflow-y: scroll;
}
.side-header {
  .icon-search {
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translate(-20%, -50%);
  }
  .search-chats {
    background-color: #f0f2f5;
    border: none;
    outline: none;
    border-radius: 1.5rem;
    font-size: 0.9rem;
    padding: 0.4rem 0 0.4rem 25px;
  }
}
.onActive {
  background-color: #c6e3ff;
}
.unseen {
  color: #41b883 !important;
  font-weight: 600;
}
.numbers {
  position: absolute;
  right: -1.7rem;
  top: 25%;
}
</style>
