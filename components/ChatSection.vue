<template>
  <section @click="onClickOutside">
    <div
      :class="[
        'chat-header d-flex flex-column',
        { 'chat-header-active': isActive }
      ]"
    >
      <div class="d-flex">
        <h2>{{ sectionData.name }}</h2>
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
        </p>
        <b-modal id="paticipants" scrollable hide-footer hide-header>
          <paticipants :sectionID="sectionData.id" />
        </b-modal>
      </div>
    </div>
    <div :class="['blink d-flex flex-column', { blinkActive: isActive }]">
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
          <b-avatar
            src="https://placekitten.com/300/300"
            size="6rem"
          ></b-avatar>
          <h3>Nguyễn Tuấn Nghĩa</h3>
          <span>Now you can start conversation together</span>
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
            :key="index"
            :class="
              `conversations d-flex align-items-${
                content.user === loged_id ? 'end ml-auto' : 'start'
              } flex-column p-2 `
            "
          >
            <div v-if="content.status === 1" class="content">
              <div
                class="message"
                :style="
                  content.user === loged_id
                    ? { 'background-color': '#41b883' }
                    : { 'background-color': '#fcbf49' }
                "
              >
                <b-row v-if="Array.isArray(content.message)">
                  <b-col
                    cols="6"
                    v-for="(src, index) in content.message"
                    :key="index"
                  >
                    <img
                      :src="`${src}`"
                      class="m-1"
                      alt=""
                      style="border-radius: 5px;
                             width: 160px;
                             height: 100px;
                              object-fit: cover;"
                    />
                  </b-col>
                </b-row>

                <span v-else>{{ content.message }}</span>
              </div>
              <div
                class="actions"
                :style="
                  content.user === loged_id
                    ? { left: '-20px' }
                    : { right: '-50px' }
                "
              >
                <b-icon
                  v-if="content.user === loged_id"
                  icon="three-dots"
                ></b-icon>
                <div
                  v-if="content.user === loged_id"
                  class="action d-flex flex-column"
                >
                  <span @click="onDelete(content.id, index)">Delete</span>
                </div>
              </div>
            </div>
            <b-avatar
              v-if="content.status === 1"
              :class="`${content.user === loged_id} ? 'to' : 'from'`"
              size="1rem"
            ></b-avatar>
          </div>
        </template>
        <div class="bottom"></div>
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
        <h4 class="font-weight-bold">Images</h4>
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
            <div><img :src="`${src}`" alt="" /></div>
          </b-col>
        </b-row>
        <h4 class="font-weight-bold">Files</h4>
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
        <b-row v-else class="p-2">
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
    <Playground :sectionID="sectionData.id" @sent="loadOnSent" />
  </section>
</template>

<script>
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
      isActive: false,
      defaultView: true,
      slide: 0,
      sliding: null,
      messages: [],
      images: [],
      loged_id: null,
      isLoadingGallery: false,
      isLoadingConversation: false
    };
  },
  async mounted() {
    this.loged_id = window.localStorage.getItem("loged_id");
  },
  methods: {
    onClickOutside() {
      $nuxt.$emit("closeModal");
    },
    loadOnSent(params) {
      this.messages.push(params);
      this.scrollToElement();
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
        this.$swal.fire(`You entered ${value}`);
      }
    },
    async getGallery() {
      this.isLoadingGallery = true;
      const listImages = [];
      await this.$axios.get("messages.json").then(res => {
        for (let index in res.data) {
          let item = res.data[index];
          if (item.chat_section === this.sectionData.id && item.status === 1) {
            if (Array.isArray(item.message)) {
              listImages.push(...item.message);
            }
          }
        }
        this.isLoadingGallery = false;
        this.images = listImages;
      });
    },
    async getData() {
      this.isLoadingConversation = true;
      const listMessage = [];
      await this.$axios.get("messages.json").then(res => {
        for (let index in res.data) {
          let item = res.data[index];
          if (item.chat_section === this.sectionData.id && item.status === 1) {
            listMessage.push({ id: index, ...item });
          }
        }
        this.isLoadingConversation = false;
        this.messages = listMessage;
      });
      this.isLoadingConversation = false;
      this.scrollToElement();
    },
    onDelete(id, index) {
      this.messages.splice(index, 1);
      this.$axios.patch(
        `/messages/${id}.json`,
        JSON.stringify({
          status: 0
        })
      );
    },
    scrollToElement() {
      const el = this.$el.getElementsByClassName("bottom")[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
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
        .b-avatar {
          position: absolute;
          bottom: 1.3rem;
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
            max-width: 30em;
            margin-bottom: 0.7rem !important;
            // looks

            padding: 0.5em 1em;
            font-size: 1em;
            border-radius: 1rem;
          }
          .actions {
            position: absolute;
            transform: translate(-50%, -50%);
            top: 40%;
            .action {
              position: absolute;
              top: 40%;
              transform: translate(-50%, -50%);
              display: none !important;
              padding: 0.2em;
              span:hover {
                display: inline-block;
                padding: 3px;
                border-radius: 3px;
                background-color: #ddd;
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
  .blinkActive {
    width: calc(100% - 300px);
  }
  .chat-header-active {
    width: calc(100% - 300px);
  }
}
</style>
