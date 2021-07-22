<template>
  <div class="play-ground d-flex">
    <div
      class=" pg-actions d-flex justify-content-between align-items-center mb-2"
    >
      <input
        ref="image"
        type="file"
        style="display: none"
        @change="onFileUpload"
        accept="image/*, video/*"
      />
      <b-icon
        icon="image"
        scale="1.3rem"
        class="mr-2"
        @click="$refs.image.click()"
      ></b-icon>
      <input
        type="file"
        accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ref="file"
        style="display: none"
        @change="onFileUpload"
      />
      <b-icon icon="files" scale="1.3rem" @click="$refs.file.click()"></b-icon>
    </div>
    <div class="message d-flex ml-auto">
      <div class="text">
        <div class="preview d-flex" v-if="images.length">
          <div v-for="(src, index) in images" :key="index">
            <img
              :src="`${src}`"
              :alt="`preview-${index}`"
              @error="$event.target.src = 'file.png'"
            />
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
        <div v-if="isReply" class="reply">
          Replying to {{ reply.name }}
          <b-icon icon="x" @click="isReply = false"></b-icon>
        </div>
        <div class="mention">
          <div v-for="(user, index) in users" :key="index">
            <div class="p-1" @click="onSelectUser(user.name)">
              <b-avatar :src="user.picture" size="2rem" class="mr-2"></b-avatar>
              <span>{{ user.name }}</span>
            </div>
          </div>
        </div>
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
      user: [],
      disableSend: false,
      isReply: false,
      reply: [],
      listUsers: [],
      users: []
    };
  },
  created() {
    this.$nuxt.$on("onReply", payload => {
      this.isReply = true;
      this.reply = payload;
      document.querySelector("textarea").focus();
    });
  },
  mounted() {
    this.logged_id = this.$auth.user.email;
    this.getListUsers();
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
      if (this.disableSend) return;
      if (this.onSelectUser()) return;
      const params = this.isReply
        ? { ...this.message(), reply: this.reply }
        : this.message();
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
          )
          .catch(err=>console.log(err));
      }
      if (this.images.length) {
        let listImages = [];
        this.disableSend = true;
        await Promise.all(this.tasks).then(
          response => ((listImages = response), (this.tasks = []))
        );
        el.style.display = "none";
        this.sendHandler({ ...params, message: listImages }).then(
          () => (
            (this.images = []),
            ((this.disableSend = false), (this.isReply = false))
          )
        );
        return;
      }
      this.sendHandler(params);
    },
    async sendHandler(params) {
      if (params.message === "" || params.message === "\n") return;
      const db = firebase.database();
      return new Promise(resolve => {
        db.ref(`chat-sections/${this.sectionID}/messages`).push({
          ...params
        });

        db.ref(`chat-sections/${this.sectionID}`).update({
          unread: true,
          sender: this.$auth.user.family_name,
          seen: [this.logged_id]
        });
        this.isReply = false;
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
    },
    getListUsers() {
      firebase
        .database()
        .ref(`chat-sections/${this.sectionID}/users`)
        .on("value", snapshot => {
          let list = [];
          if (snapshot.exists()) {
            list = snapshot.val();
          }
          this.listUsers = list;
        });
    },
    onMention(px, text) {
      this.users = [];
      const regex = new RegExp(`${text}`, "gi");
      document
        .querySelector(".mention")
        .setAttribute(
          "style",
          `left: calc(400px + ${px * 6 > 700 ? 700 : px * 7}px)`
        );
      const users = [];
      firebase
        .database()
        .ref(`users`)
        .get()
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
              if (this.listUsers.includes(data[key].email)) {
                users.push(data[key]);
              }
            }
            if (text === "") {
              this.users = users;
              return;
            }
            this.users = users.filter(user => user.name.match(regex));
          }
        });
    },
    onSelectUser(name) {
      const regex = /[?=@]+([a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ|_])*$/gi;
      if (name || this.users.length) {
        this.content = this.content.replace(
          regex,
          `@${name || this.users[0].name}`
        );
        document.querySelector("textarea").focus();
        this.users = [];
        return true
      }
      return false
    }
  },
  watch: {
    content: {
      handler(message) {
        const regex = /[@]\w*$/g;
        if (message.match(regex)) {
          let text = message
            .match(regex)
            .toString()
            .substring(1);
          this.onMention(message.length, text);
        } else {
          document
            .querySelector(".mention")
            .setAttribute("style", "display: none");
        }
      }
    },
    sectionID: {
      handler() {
        this.getListUsers();
        this.content = "";
      }
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
        top: -130px;
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
            height: 100px;
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
      .reply {
        position: absolute;
        top: -50%;
        right: 0;
        background: #ebebeb;
        border-radius: 0.8rem;
        padding: 0 0.5rem;
        font-weight: bolder;
        z-index: 100;
        .b-icon {
          cursor: pointer;
        }
      }
      .mention {
        position: fixed;
        bottom: -70px;
        margin-bottom: 130px;
        background: #ebebeb;
        border-radius: 7px;
        div {
          width: 200px;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: clip;
          &:hover {
            background: #c6e3ff;
          }
        }
        & > div:first-child {
          background: #41b883;
          color: #273849;
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
