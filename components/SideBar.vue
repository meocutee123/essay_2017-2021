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
          <new_conversation />
        </b-modal>
      </div>
      <div style="position: relative" class="d-flex align-items-center px-2">
        <b-icon icon="search" class="icon-search"></b-icon>
        <input
          type="text"
          placeholder="Search Messenger"
          class="search-chats w-100"
          @keyup.enter="test()"
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
        @click="openChatSection(chat.id)"
        :class="[{ onActive: chat.isActive }, 'user d-flex']"
      >
        <div :ref="`section-${index}`"></div>
        <b-avatar size="3.3rem" src="/nayeon.jpg"></b-avatar>
        <div>
          <h4 class="mb-0">
            {{ chat.name }}
          </h4>
          <small class="ml-3">
            Lorem ipsum dolor.
          </small>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase/app";
var db = firebase.firestore();
import new_conversation from "../page_modals/new_conversation.vue";

export default {
  data() {
    return {
      tabIndex: 0,
      chatSections: [],
      isLoadingSection: false
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
    this.logged_id = window.localStorage.getItem("logged_id");
    await this.getData();
    this.autoLoadData();
    this.chatSections[0] && this.openChatSection(this.chatSections[0].id);
  },
  methods: {
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
      // setTimeout(() => {
      //   const el = this.$el.getElementsByClassName("onActive")[0];
      //   if (el) {
      //     el.scrollIntoView({ behavior: "smooth" });
      //   }
      // }, 300);
      await this.$axios
        .get(`/chat-sections/${id}.json`, { progress: false })
        .then(response => {
          this.$emit(
            "openChatSection",
            Object.assign({}, response.data, { id: id })
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * Load on new conversation created
     */
    autoLoadData() {
      setInterval(async () => {
        let initLength = this.chatSections.length;
        let temp = [];
        await this.$axios
          .get("chat-sections.json", { progress: false })
          .then(({ data }) => {
            for (let index in data) {
              if (data[index].users.includes(this.logged_id)) {
                temp.push({ ...data[index], id: index });
              }
              continue;
            }
          });
        if (temp.length > initLength) {
          let index = temp.length - initLength;
          let object = temp.splice(Math.max(temp.length - index), 1);
          this.chatSections.unshift(...object);
        }
      }, 10000);
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
      div {
        h4 {
          margin-left: 16px;
          font-weight: bold;
          max-width: 200px;
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
</style>
