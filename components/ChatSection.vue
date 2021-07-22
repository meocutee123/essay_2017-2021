<template>
  <section @click="onClickOutside">
    <div
      :class="[
        'chat-header d-flex flex-column',
        { 'chat-header-active': isActive }
      ]"
    >
      <div class="d-flex align-items-center">
        <h2
          id="title"
          style=" max-width: 500px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;"
        >
          {{ chats.name }}
        </h2>
        <b-icon
          v-if="sectionData.host === logged_id || options.allow_name"
          style="cursor: pointer"
          @click="changeTitle(sectionData)"
          class="h6 ml-4"
          icon="pencil-fill"
        ></b-icon>
        <!-- <div
          class="ml-auto actions d-flex justify-content-between align-items-center"
        >
          <b-icon icon="telephone" scale="1.3rem"></b-icon>
          <b-icon icon="camera-video" scale="1.3rem"></b-icon>
          <b-icon icon="person-plus" scale="1.3rem"></b-icon>
        </div> -->
      </div>
      <div class="detail d-flex justify-content-between align-items-center">
        <p style="white-space: nowrap;">
          <span v-b-modal.paticipants>{{
            getParticipants + " participants"
          }}</span>
          |
          <span
            @click="
              isActive = !isActive;
              getGallery();
            "
            ><b-icon icon="journal-album" scale="1rem"></b-icon> Gallery</span
          >
          |
          <span @click="onSearch()"
            ><b-icon icon="search" scale="1rem"></b-icon> Find</span
          >
          |
          <export-excel
            :data="messages"
            :fields="fields"
            :worksheet="sectionData.name"
            :name="`${new Date().toISOString()}${sectionData.id}.xls`"
            class="d-inline-block ml-2"
          >
            <b-icon class="mr-2" icon="cloud-arrow-down" scale="1.2rem"></b-icon
            >Export</export-excel
          >
          |
          <span v-b-modal.settings v-if="sectionData.host == logged_id"
            ><b-icon icon="gear-fill" scale="1rem"></b-icon> Settings</span
          >
        </p>
        <b-modal id="settings" scrollable hide-footer hide-header>
          <b-form-group>
            <label class="font-weight-bold mt-2">Section settings</label>
            <div class="d-flex">
              <b-form-checkbox
                v-model="options.allow_add"
                name="check-button"
                switch
                class="mr-3"
              >
                New paticipants
              </b-form-checkbox>
              <b-form-checkbox
                v-model="options.allow_name"
                name="check-button"
                switch
              >
                Group title
              </b-form-checkbox>
            </div>
            <label class="font-weight-bold mt-2"
              >Maximum members:
              <span class="text-success">{{ options.members }}</span></label
            >
            <b-form-input
              id="range-1"
              v-model.number="options.members"
              type="range"
              min="2"
              max="10"
            ></b-form-input>
            <b-button
              @click="settings()"
              class="btn-sm font-weight-bold"
              style="background: #41b883;"
              >Confirm</b-button
            >
          </b-form-group>
        </b-modal>
        <b-modal id="paticipants" scrollable hide-footer hide-header>
          <paticipants :sectionID="sectionData.id" />
        </b-modal>
      </div>
    </div>
    <div
      id="chats"
      :class="['blink d-flex flex-column', { blinkActive: isActive }]"
    >
      <div class="chat-section mt-auto px-3">
        <div
          v-if="isLoadingConversation"
          class="greetings d-flex flex-column align-items-center p-2"
        >
          <b-skeleton width="100px" height="100px" type="avatar"></b-skeleton>
          <h3 class="mt-2">
            <b-skeleton
              height="1.7rem"
              animation="wave"
              width="230px"
            ></b-skeleton>
          </h3>
          <span><b-skeleton animation="wave" width="300px"></b-skeleton></span>
        </div>
        <div v-else class="greetings text-center p-2">
          <b-avatar-group size="3rem" class="d-flex justify-content-center">
            <b-avatar
              v-for="(avt, index02) in chats.avatar"
              :key="index02"
              :src="`${avt}`"
            ></b-avatar>
          </b-avatar-group>
          <h3>{{ chats.name }}</h3>
          <span @click="scrollToElement()"
            >Now you can start conversation together</span
          >
        </div>
        <div
          v-if="isLoadingConversation"
          class="
              conversations d-flex align-items-end ml-auto flex-column p-2 
            "
        >
          <b-skeleton animation="wave" width="85%"></b-skeleton>
          <b-skeleton animation="wave" width="55%"></b-skeleton>
          <b-skeleton animation="wave" width="70%"></b-skeleton>
        </div>
        <div
          v-if="isLoadingConversation"
          class="
              conversations d-flex align-items-start flex-column p-2 
            "
        >
          <b-skeleton animation="wave" width="85%"></b-skeleton>
          <b-skeleton animation="wave" width="55%"></b-skeleton>
          <b-skeleton animation="wave" width="70%"></b-skeleton>
          <b-skeleton animation="wave" width="30%"></b-skeleton>
          <b-skeleton animation="wave" width="70%"></b-skeleton>
        </div>
        <div
          v-if="isLoadingConversation"
          class="
              conversations d-flex align-items-end ml-auto flex-column p-2 
            "
        >
          <b-skeleton animation="wave" width="25%"></b-skeleton>
        </div>
        <template v-for="(content, index) in messages">
          <div
            style="font-size: .7rem"
            id="date"
            class="text-muted text-center border-bottom"
            v-if="content.newDate"
            :key="`as-${index}`"
          >
            {{ new Date(content.created_at).toDateString() }}
          </div>
          <div
            :key="index"
            :id="`message-${index}`"
            :class="
              `conversations d-flex align-items-${
                content.user === logged_id ? 'end ml-auto' : 'start mr-auto'
              } flex-column p-2 `
            "
          >
            <small v-if="content.user !== logged_id">
              <b-icon v-if="content.reply" icon="reply-fill"></b-icon>
              {{ content.name }}
              <span v-if="content.reply">{{
                content.reply.user === logged_id
                  ? "replied to you"
                  : `replied to ${content.reply.name}`
              }}</span></small
            >
            <div class="content d-flex flex-column">
              <template v-if="!content.status">
                <div class="unsent">
                  {{
                    $auth.user.email === content.user
                      ? "You unsent a message."
                      : content.name + " unsent a message."
                  }}
                </div>
              </template>
              <template v-else>
                <div
                  class="message"
                  :style="[
                    content.user === logged_id
                      ? { 'background-color': '#41b883' }
                      : { 'background-color': '#fcbf49' },
                    { width: 'max-content' }
                  ]"
                >
                  <div class="content-reply" v-if="content.reply">
                    <b-row v-if="Array.isArray(content.reply.message)">
                      <b-col
                        cols="6"
                        class="px-0"
                        v-for="(src, index) in content.reply.message"
                        :key="index"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center p-1"
                          v-if="!isFile(src).status"
                          style="border-radius: 5px;
                             width: 160px;
                             height: 100px;
                            cursor: pointer;
                            
                          overflow-y: hidden"
                        >
                          <b-icon
                            class="w-50 mr-1"
                            scale="5rem"
                            icon="file-earmark-zip"
                          ></b-icon>
                          <a
                            :href="src"
                            style="color: #35495e;
                          width: 40%;
                          "
                            >{{ isFile(src).name }}</a
                          >
                        </div>
                        <img
                          v-else
                          @click="openImage(src)"
                          :src="`${src}`"
                          class="m-1"
                          alt=""
                          style="border-radius: 5px;
                             width: 200px;
                             max-height: 600px;
                              object-fit: cover; cursor: pointer"
                        />
                      </b-col>
                    </b-row>

                    <template v-else>
                      <div
                        @click="openLink(index)"
                        class="link-preview d-flex flex-column"
                        v-if="content.reply.message.url"
                      >
                        <span>{{ content.reply.message.text }}</span>
                        <img
                          style="height: 100px; object-fit: cover; border-radius: 1rem"
                          :src="`${content.reply.message.image}`"
                          :alt="`${content.reply.message.title}`"
                        />
                        <span class="font-weight-bold">
                          {{ content.reply.message.title }}
                        </span>
                        <a
                          :ref="`link-${index}`"
                          style="display: none"
                          :href="`${content.reply.message.url}`"
                          target="_blank"
                        ></a>
                        <small>{{ content.reply.message.url }}</small>
                      </div>
                      <div v-else>{{ content.reply.message }}</div>
                    </template>
                  </div>
                  <b-row v-if="Array.isArray(content.message)">
                    <b-col
                      cols="6"
                      class="px-0"
                      v-for="(src, index) in content.message"
                      :key="index"
                    >
                      <div
                        class="d-flex align-items-center justify-content-center p-1"
                        v-if="!isFile(src).status"
                        style="border-radius: 5px;
                             width: 160px;
                             height: 100px;
                            cursor: pointer;
                            
                          overflow-y: hidden"
                      >
                        <b-icon
                          class="w-50 mr-1"
                          scale="5rem"
                          icon="file-earmark-zip"
                        ></b-icon>
                        <a
                          :href="src"
                          style="color: #35495e;
                          width: 40%;
                          "
                          >{{ isFile(src).name }}</a
                        >
                      </div>
                      <img
                        v-else
                        @click="openImage(src)"
                        :src="`${src}`"
                        class="m-1"
                        alt=""
                        style="border-radius: 5px;
                             width: 200px;
                             max-height: 600px;
                              object-fit: cover; cursor: pointer"
                      />
                    </b-col>
                  </b-row>

                  <template v-else>
                    <div
                      @click="openLink(index)"
                      class="link-preview d-flex flex-column"
                      v-if="content.message.url"
                    >
                      <span>{{ content.message.text }}</span>
                      <img
                        style="height: 100px; object-fit: cover; border-radius: 1rem"
                        :src="`${content.message.image}`"
                        :alt="`${content.message.title}`"
                      />
                      <span class="font-weight-bold">
                        {{ content.message.title }}
                      </span>
                      <a
                        :ref="`link-${index}`"
                        style="display: none"
                        :href="`${content.message.url}`"
                        target="_blank"
                      ></a>
                      <small>{{ content.message.url }}</small>
                    </div>
                    <div v-else>{{ content.message }}</div>
                  </template>
                </div>

                <div
                  v-if="isInChats"
                  class="actions"
                  :style="
                    content.user === logged_id
                      ? { left: '-20px' }
                      : { right: '-30px' }
                  "
                >
                  <b-icon icon="three-dots"></b-icon>
                  <div class="action d-flex flex-column">
                    <span
                      v-if="content.user === logged_id"
                      @click="onDelete(content.id)"
                      style="font-size: 13px"
                      >Remove</span
                    >
                    <span
                      v-if="content.user !== logged_id"
                      @click="onReply({ ...content, index: index })"
                      style="font-size: 13px"
                      >Reply</span
                    >
                  </div>
                </div>
              </template>
            </div>
            <div
              :class="[
                'icon-float d-flex align-items-center',
                content.user === logged_id ? '' : 'flex-row-reverse'
              ]"
            >
              <small class="mx-1">{{
                new Date(content.created_at).toLocaleTimeString()
              }}</small
              ><b-avatar
                :class="`${content.user === logged_id} ? 'to' : 'from'`"
                size="2rem"
                :src="content.picture"
              ></b-avatar>
            </div>
          </div>
        </template>
        <div class="bottom"></div>
      </div>
      <Playground v-if="isInChats" :sectionID="sectionData.id" />
      <div v-else class="hasRemoved d-flex align-items-center justify-content-center">
        You have been removed!
      </div>
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
        <h4 class="font-weight-bold">Recent files</h4>
        <b-row class="p-2" v-if="isLoadingGallery">
          <b-col cols="6" class="p-2">
            <div>
              <b-skeleton-img
                no-aspect
                height="8rem"
                width="8rem"
              ></b-skeleton-img>
            </div>
          </b-col>
          <b-col cols="6" class="p-2">
            <div>
              <b-skeleton-img
                no-aspect
                height="8rem"
                width="8rem"
              ></b-skeleton-img>
            </div>
          </b-col>
          <b-col cols="6" class="p-2">
            <div>
              <b-skeleton-img
                no-aspect
                height="8rem"
                width="8rem"
              ></b-skeleton-img>
            </div>
          </b-col>
          <b-col cols="6" class="p-2">
            <div>
              <b-skeleton-img
                no-aspect
                height="8rem"
                width="8rem"
              ></b-skeleton-img>
            </div>
          </b-col>
        </b-row>
        <b-row class="p-2">
          <b-col
            v-for="(src, index) in images"
            :key="index"
            cols="6"
            class="p-2"
          >
            <div class="d-flex bg-warning p-1" v-if="!isFile(src).status">
              <b-icon
                class="w-50 mr-1 text-dark align-self-center"
                scale="5rem"
                icon="file-earmark-zip"
              ></b-icon>
              <a
                :href="src"
                style="color: #35495e;
                          width: 40%;
                          word-wrap: break-word;
                          "
                >{{ isFile(src).name }}</a
              >
            </div>
            <div v-else>
              <img :src="`${src}`" @click="openImage(src)" alt="" />
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
    <b-modal
      :id="`modal-image`"
      centered
      hide-footer
      hide-header
      no-fade
      size="xl"
    >
      <b-img :src="src" style="width: 100%; height: auto"></b-img>
    </b-modal>
  </section>
</template>

<script>
import firebase from "firebase/app";
import paticipants from "../page_modals/paticipants.vue";
export default {
  components: { paticipants },
  props: {
    sectionData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      src: null,
      user_temp: null,
      media: [],
      isActive: false,
      defaultView: true,
      slide: 0,
      sliding: null,
      messages: [],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8"
          }
        ]
      ],
      images: [],
      logged_id: null,
      isLoadingGallery: false,
      isLoadingConversation: false,
      scrolled: false,
      chats: [],
      options: {},
      isInChats: true
    };
  },
  filters: {},
  async mounted() {
    this.logged_id = this.$auth.user.email;
    this.getData();
  },
  methods: {
    isFile(value) {
      const regex = /\.(gif|jpe?g|jfif?|tiff?|png|webp|bmp)$/i;
      let name = firebase.storage().refFromURL(value).name;
      console.log(name);
      return {
        status: regex.test(name),
        name: name
      };
    },
    onClickOutside() {
      $nuxt.$emit("closeModal");
    },
    async onSearch() {
      const { value } = await this.$swal.fire({
        title: "Enter search term",
        input: "text",
        showCancelButton: true,
        confirmButtonColor: "#41b883",
        inputValidator: value => {
          if (!value) {
            return "You need to write something!";
          }
        }
      });

      if (value) {
        const index = this.messages.findIndex(item => {
          const regex = new RegExp(`${value}`, "g");
          if (Array.isArray(item.message)) {
            return;
          }
          if (item.message.text) {
            return item.message.text.match(regex);
          } else {
            return item.message.match(regex);
          }
        });
        if (index == -1) {
          this.$swal.fire(`No message match`);
          return;
        }
        setTimeout(() => {
          const el = document.getElementById(`message-${index}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 200);
      }
    },
    async getGallery() {
      this.isLoadingGallery = true;
      firebase
        .database()
        .ref(`chat-sections/${this.sectionData.id}/messages`)
        .on("value", snapshot => {
          const listImages = [];
          this.media = [];
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let index in data) {
              let item = data[index];
              if (item.status && Array.isArray(item.message)) {
                listImages.push(...item.message);
              }
            }
            this.isLoadingGallery = false;
            this.images = listImages.reverse();
          } else {
            this.isLoadingGallery = false;
            this.images = [];
          }
        });
    },
    getData() {
      this.isLoadingConversation = true;
      let temp;
      let newDate = true;
      firebase
        .database()
        .ref("chat-sections/" + this.sectionData.id)
        .on("value", snapshot => {
          this.chats = [];
          if (snapshot.exists()) {
            this.chats = snapshot.val();
            this.options = this.chats.options;
            this.isInChats =
              this.chats.users.find(email => email === this.logged_id) || false;
          } else {
            this.chats = [];
          }
        });
      firebase
        .database()
        .ref("chat-sections/" + this.sectionData.id + "/messages")
        .on("value", snapshot => {
          const listMessage = [];
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let index in data) {
              let item = data[index];
              if (!item.status) {
                item.message = "This message has been deleted.";
              }
              let date = new Date(item.created_at).toLocaleDateString();
              if (temp != date) {
                newDate = true;
                temp = date;
              } else {
                newDate = false;
              }
              listMessage.push({
                id: index,
                ...item,
                newDate: newDate
              });
            }
            this.messages = listMessage;
            setTimeout(() => {
              this.isLoadingConversation = false;
              this.scrollToElement();
            }, 500);
          } else {
            this.messages = [];
            setTimeout(() => {
              this.isLoadingConversation = false;
              this.scrollToElement();
            }, 500);
          }
        });
    },
    onDelete(id) {
      firebase
        .database()
        .ref(`chat-sections/${this.sectionData.id}/messages/${id}`)
        .update({
          status: 0,
          name: this.$auth.user.name
        });
    },
    onReply(message) {
      $nuxt.$emit("onReply", message);
    },
    async changeTitle({ id }) {
      this.$swal
        .fire({
          title: "Enter conversation name",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Submit",
          showLoaderOnConfirm: true,
          inputValidator: value => {
            if (!value) {
              return "You need to write something!";
            }
          },
          preConfirm: text => {
            // if(text === "") {
            //   this.$swal.showValidationMessage(`Something went wrong: ${error}`);
            // }
            return firebase
              .database()
              .ref(`/chat-sections/${id}`)
              .update({
                name: text
              })
              .then(() => text)
              .catch(error => {
                this.$swal.showValidationMessage(
                  `Something went wrong: ${error}`
                );
              });
          }
        })
        .then(result => {
          if (result.isConfirmed) {
            document.querySelector("#title").innerHTML = result.value;
          }
        });
    },
    scrollToElement() {
      const el = this.$el.getElementsByClassName("bottom")[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    openLink(index) {
      this.$refs[`link-${index}`][0].click();
    },
    openImage(src) {
      this.src = src;
      this.$bvModal.show(`modal-image`);
    },
    settings() {
      firebase
        .database()
        .ref("chat-sections/" + this.sectionData.id + "/options")
        .update(this.options);
      setTimeout(() => {
        this.$bvModal.hide("settings");
      }, 250);
    }
  },
  computed: {
    getParticipants() {
      if (this.chats.users) {
        return this.chats.users.length;
      }
      return "Loading";
    },
    fields() {
      return {
        created_at: "created_at",
        status: "status",
        created_by: "name",
        content: {
          field: "message",
          callback: value => {
            if (Array.isArray(value)) {
              return "Files: " + value.join(", ");
            }
            if (value.url) {
              return value.text;
            }
            return value;
          }
        }
      };
    }
  },
  watch: {
    sectionData: {
      deep: true,
      handler() {
        this.getData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
    .chat-section {
      overflow-x: hidden;
      position: absolute;
      width: 100%;
      bottom: 3.5rem;
      background-color: #e3fff2;
      height: calc(100% - 56px);
      overflow-y: scroll;
      border-radius: 5px;
      .conversations {
        max-width: 400px;
        position: relative;
        .icon-float {
          position: absolute;
          bottom: -4px;
        }
        .to {
          right: -0.8rem;
        }
        .from {
          left: -0.8rem;
        }
        .content {
          position: relative;
          .message {
            display: inline-block;
            // layout
            position: relative;
            max-width: 450px;
            margin-bottom: 0.7rem !important;
            // looks
            overflow-wrap: break-word;
            padding: 0.5em 1em;
            font-size: 1em;
            border-radius: 1rem;
          }
          .content-reply {
            z-index: 10;
            background: #e5bcea;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
          }
          .actions {
            position: absolute;
            transform: translate(-50%, -50%);
            top: 40%;

            .action {
              position: absolute;
              top: 57%;
              transform: translate(-50%, -50%);
              display: none !important;
              padding: 0.3em;
              border-radius: 5px;
              background-color: #ddd;

              span:hover {
                color: #41b883;
              }
            }
            &:hover {
              cursor: pointer;
              .action {
                display: block !important;
              }
            }
          }
        }
      }
    }
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
  .unsent {
    padding: 4px 5px;
    background: #ebebeb;
    border-radius: 10px;
    margin-bottom: 8px;
  }
  .blinkActive {
    width: calc(100% - 300px) !important;
  }
  .chat-header-active {
    width: calc(100% - 300px);
  }
  .d-inline-block:hover {
    cursor: pointer;
    color: #35495e;
  }
}
.link-preview:hover {
  cursor: pointer;
}
.hasRemoved {
  height: 3.5rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  background: rgb(255, 203, 203)
}
</style>
