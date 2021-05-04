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
        <div v-for="chat in chatSections" :key="chat.id" class="user d-flex">
          <b-avatar size="3.3rem" src="/nayeon.jpg"></b-avatar>
          <span
            >Im Nayeon
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
    <section @click="onClickOutside">
      <div
        :class="[
          'chat-header d-flex flex-column',
          { 'chat-header-active': isActive }
        ]"
      >
        <div class="d-flex">
          <h2>Batch 5 - DH Nha Trang</h2>
          <div
            class="ml-auto actions d-flex justify-content-between align-items-center"
          >
            <b-icon icon="telephone" scale="1.3rem"></b-icon>
            <b-icon icon="camera-video" scale="1.3rem"></b-icon>
            <b-icon icon="person-plus" scale="1.3rem"></b-icon>
          </div>
        </div>
        <div class="detail d-flex justify-content-between align-items-center">
          <p>
            <span v-b-modal.paticipants>13 paticipants</span> |
            <span @click="isActive = !isActive"
              ><b-icon icon="journal-album" scale="1rem"></b-icon> Gallery</span
            >
            |
            <span><b-icon icon="search" scale="1rem"></b-icon> Find</span>
          </p>
          <b-modal id="paticipants" scrollable hide-footer hide-header>
            <paticipants />
          </b-modal>
        </div>
      </div>
      <div :class="['blink d-flex flex-column', { blinkActive: isActive }]">
        <ChatSection :messages="messages">
          <template v-slot:greetings>
            <div class="greetings text-center p-2">
              <b-avatar
                src="https://placekitten.com/300/300"
                size="6rem"
              ></b-avatar>
              <h3>Nguyễn Tuấn Nghĩa</h3>
              <span>Now you can start conversation together</span>
            </div>
          </template>
        </ChatSection>
        <Playground @onClickSend="sendMessage" />
      </div>
      <div :class="[{ active: isActive }, 'gallery px-2']" id="gallery">
        <div class="gallery-head d-flex align-items-center">
          <b-icon
            @click="isActive = !isActive"
            class="mb-1"
            icon="x"
            scale="2rem"
          ></b-icon>
          <h2 class="ml-3">Gallery</h2>
        </div>
        <div class="images">
          <h4 class="font-weight-bold">Images</h4>
          <b-row class="p-2">
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
          </b-row>
          <h4 class="font-weight-bold">Files</h4>
          <b-row class="p-2">
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
            <b-col cols="6" class="p-2">
              <div><img src="/nayeon.jpg" alt="" /></div>
            </b-col>
          </b-row>
        </div>
      </div>
    </section>
  </page-container>
</template>

<script>
import { mapState } from "vuex";

import new_conversation from "../page_modals/new_conversation.vue";
import paticipants from "../page_modals/paticipants.vue";
export default {
  components: { new_conversation, paticipants },
  data() {
    return {
      chatSections: [],
      isActive: false,
      onFocus: false,
      email: "",
      password: ""
    };
  },
  mounted(){
    this.$store.dispatch('getMessages')
  },
  methods: {
    onClickOutside() {
      $nuxt.$emit("closeModal");
    },
    async sendMessage(content) {
      await this.$axios
        .post("messages.json", JSON.stringify(content))
        .then(response => {
          console.log(response.data);
          this.$store.dispatch("updateMessage", content);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapState(["messages"])
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
section {
  position: relative;
  height: inherit;
  width: 100%;
  min-width: 500px;
  .chat-header {
    background-color: #ffffff;
    border-bottom: 1px solid #e4e6eb;
    padding: 1rem 1rem 0.3rem 1rem;
    z-index: 2;
    max-height: 100px;
    min-width: 400px;
    h2 {
      font-weight: bolder;
    }
    .actions {
      width: 100px;
      .b-icon {
        cursor: pointer;
      }
    }
    .detail {
      max-width: 70%;
      p {
        font-size: 0.8rem;
        color: #d8dbe0;
        font-weight: bold;
        span {
          margin: 0.4rem;
          transition: 0.4s;
          &:hover {
            cursor: pointer;
            color: #35495e;
          }
        }
      }
      .search-text-form {
        padding: 0;
        margin: 0;
        .search-text {
          outline: none;
          border: 1px solid #d8dbe0;
          margin: 0;
        }
        span {
          display: inline-block;
          border: 1px solid #d8dbe0;
          font-size: 0.9rem;
          padding: 0.2em;
        }
      }
    }
  }
  .blink {
    height: calc(100% - 100px);
    width: 100%;
    position: relative;
    .greetings {
      h3 {
        font-weight: bolder;
      }
      span {
        color: #a3a3a3;
      }
    }
  }
  .gallery {
    border-left: 1px solid #e4e6eb;
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
    height: inherit;
    transform: translateX(100%);
    z-index: 100;
    background-color: #ffffff;
    .gallery-head {
      background-color: #ffffff;
      padding-left: 1rem;
      .mb-1 {
        cursor: pointer;
      }
      h2 {
        font-weight: bolder;
      }
    }
    .images {
      max-height: 90%;
      overflow-y: scroll;
      overflow-x: hidden;
      h4 {
        padding-bottom: 0.4em;
        border-bottom: 1px solid #e4e6eb;
      }
      .row {
        .col-6 > div {
          height: 8em;
          width: 8em;
          overflow: hidden;
          border-radius: 0.6em;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.4s;
            &:hover {
              cursor: pointer;
              transform: scale(1.05);
            }
          }
        }
      }
    }
  }
  .active {
    transform: translateX(0);
  }
  .blinkActive {
    width: calc(100% - 300px);
  }
  .chat-header-active {
    width: calc(100% - 300px);
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
