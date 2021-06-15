<template>
  <div class="play-ground d-flex">
    <div
      class=" pg-actions d-flex justify-content-between align-items-center mb-2"
    >
      <input
        ref="file"
        type="file"
        style="display: none"
        @change="onFileUpload"
        accept="image/*"
      />
      <b-icon icon="image" scale="1.3rem" @click="$refs.file.click()"></b-icon>
      <b-icon icon="share-fill" scale="1.3rem"></b-icon>
      <input
        type="file"
        accept="audio/*;capture=microphone"
        ref="audio"
        style="display: none"
      />
      <b-icon
        icon="mic-fill"
        scale="1.3rem"
        @click="$refs.audio.click()"
      ></b-icon>
    </div>
    <div class="message d-flex">
      <div class="text">
        <div class="preview d-flex" v-if="images.length">
          <div v-for="(src, index) in images" :key="index">
            <img :src="`${src}`" :alt="`preview-${index}`" />
            <b-icon
              icon="x"
              scale="1.5rem"
              @click="onDeleteImage(index)"
            ></b-icon>
          </div>
          <b-icon
            id="arrow-clockwise"
            class="align-self-center"
            icon="arrow-clockwise"
            animation="spin"
            scale="1.3rem"
            style="color: #41b883; display: none"
          ></b-icon>
        </div>
        <textarea
          rows="2"
          placeholder="Type a message"
          @focus="onFocus = true"
          @blur="onfocus = false"
          v-model.trim="content"
          @keyup.enter.exact="onClickSend()"
        ></textarea>
        <b-icon
          class="icon-smile"
          icon="emoji-smile-fill"
          scale="1.4rem"
        ></b-icon>
      </div>
      <b-icon
        @click="onClickSend()"
        class="focus-icon mt-2 mx-3"
        icon="cursor-fill"
        scale="1.4rem"
      ></b-icon>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
export default {
  props: ["sectionID"],
  data() {
    return {
      onFocus: false,
      content: "",
      images: [],
      tasks: [],
      logged_id: null,
      user: []
    };
  },
  mounted() {
    this.logged_id = this.$auth.user.email;
  },
  methods: {
    onDeleteImage(index) {
      this.images.splice(index, 1);
      this.tasks.splice(index, 1);
    },
    onFileUpload(e) {
      let output = this.$refs.file;
      if (!e.target.files[0]) return;
      output.src = URL.createObjectURL(e.target.files[0]);
      this.images.push(output.src);
      this.tasks.push(this.uploadFile(e));
    },
    uploadFile(e) {
      const file = e.target.files[0];
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(file.name);
      return new Promise((resolve, reject) => {
        resolve(
          fileRef.put(file).then(snapshot =>
            snapshot.ref.getDownloadURL().then(dowloadURL => {
              return dowloadURL;
            })
          )
        );
      });
    },
    async onClickSend() {
      const params = this.message();
      this.content = "";
      const el = document.getElementById("arrow-clockwise");
      if (el) {
        el.style.display = "block";
      }
      const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

      if (params.message.match(regex)) {
        await this.$axios
          .get(
            `?key=7ec772f6a66894f854b1b2c29372e8d6&q=${
              params.message.slice(0, 4) !== "http"
                ? "https://" + params.message
                : params.message
            }`
          )
          .then(
            ({ data }) => (params.message = { ...data, text: params.message })
          );
      }
      if (this.images.length) {
        let listImages = [];
        await Promise.all(this.tasks).then(
          response => ((listImages = response), (this.tasks = []))
        );
        el.style.display = "none";
        this.sendHandler({ ...params, message: listImages }).then(
          () => (this.images = [])
        );
      }
      this.sendHandler(params);
    },
    async sendHandler(params) {
      if (params.message === "" || params.message === "\n") return;
      const db = firebase.database();
      return new Promise(resolve => {
        db.ref(`chat-sections/${this.sectionID}/messages`).push(
          {
            ...params
          }
        );

        db.ref(`chat-sections/${this.sectionID}`).update({
          unread: true,
          sender: this.$auth.user.family_name,
          seen: [this.logged_id]
        });
        resolve(true);
      });
    },
    message() {
      return {
        message: this.content,
        user: this.logged_id,
        created_at: new Date().toISOString(),
        status: 1,
        picture: this.$auth.user.picture,
        name: this.$auth.user.name
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.play-ground {
  max-height: 3.5rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  .pg-actions {
    color: #41b883;
    padding: 5px 15px 5px 10px;
    min-width: 150px;
    transition: 0.2s;
    .b-icon {
      &:hover {
        cursor: pointer;
        color: #bbfee4;
      }
    }
  }
  .message {
    width: inherit;
    .text {
      width: 93%;
      position: relative;
      .preview {
        position: absolute;
        top: -70px;
        div {
          margin: 0.5em;
          background: #98dfbf;
          border-radius: 10px;
          position: relative;

          .b-icon {
            position: absolute;
            top: 1%;
            right: 2%;
            &:hover {
              cursor: pointer;
            }
          }
          img {
            border-radius: 5px;
            width: 100px;
            height: 55px;
            object-fit: cover;
            transition: 0.3s;
          }
        }
      }
      textarea {
        width: 100%;
        height: 2rem !important;
        border-radius: 2rem;
        outline: none;
        border: none;
        background-color: #41b883;
        resize: none;
        padding-left: 0.5rem;
        color: #273849;
        font-size: 1rem;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .icon-smile {
        position: absolute;
        color: #41b883;
        top: 0.5rem;
        right: 0.5rem;
        transition: 0.2s;
        &:hover {
          cursor: pointer;
          color: #98dfbf;
        }
      }
    }
    .focus-icon {
      color: #41b883;
      transition: 0.2s;
      &:hover {
        cursor: pointer;
        color: #98dfbf;
      }
    }
  }
}
</style>
