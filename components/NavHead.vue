<template>
  <b-navbar
    class="header border-bottom d-flex justify-content-between py-0"
    toggleable="lg"
    type="dark"
    variant="light"
  >
    <b-navbar-brand class="d-flex">
      <div class="brand mx-1" style="border-bottom: 2px solid #06d6a0;">
        <span class="h6">N</span>
        <span class="h5">e</span>
        <span class="h4">x</span>
        <span class="h3">t</span>
        <span class="h2" style="color: #35495e; font-weight: bold">TREND</span>
      </div>
      <b-icon
        icon="chat-dots-fill"
        style="color: #06d6a0;"
        scale="1.4rem"
        shift-v="5"
      ></b-icon>
    </b-navbar-brand>
    <div class="search d-flex" style="position: relative">
      <b-input-group>
        <b-form-input
          id="search"
          placeholder="Type to search for chat"
        ></b-form-input>
      </b-input-group>
      <div
        style="z-index: 1000;position: absolute; color: #273849; background: rgb(37 218 171); top: 6vh; width: 220px; border-radius: .5rem"
        id="htmlOut"
      ></div>
    </div>
    <div :class="[{ active: isActive }, 'home d-flex align-items-center']">
      <div @click="openModal('profile')" class="profile">
        <b-avatar
          variant="danger"
          size="2rem"
          :src="`${$auth.user.picture || 'https://placekitten.com/300/300'}`"
        ></b-avatar
        ><span>{{ $auth.user.family_name }}</span>
      </div>
      <b-button
        pill
        class="btn-light-grey"
        id="friends"
        @click="openModal('friends')"
      >
        <b-icon icon="people-fill" aria-hidden="true" scale=".8rem"></b-icon>
        <b-tooltip target="friends" triggers="hover">Friends</b-tooltip>
      </b-button>
      <b-button
        pill
        class="btn-light-grey"
        id="notification"
        @click="openModal('notification')"
      >
        <b-icon icon="bell-fill" aria-hidden="true" scale=".8rem" />
        <b-badge class="badge" variant="danger" id="noti"></b-badge>
        <b-tooltip target="notification" triggers="hover"
          >Notification</b-tooltip
        >
      </b-button>
      <b-button
        pill
        class="btn-light-grey"
        v-b-tooltip.hover
        title="Settings"
        @click="openModal('settings')"
        ><b-icon
          icon="caret-up-fill"
          font-scale=".8"
          aria-hidden="true"
          flip-h
          flip-v
        ></b-icon
      ></b-button>
      <v-modal name="modal">
        <component :is="isComponent" :user="logged_user[0]"></component>
      </v-modal>
    </div>
    <b-toast
      id="my-toast"
      toaster="b-toaster-bottom-left"
      variant="success"
      no-close-button
    >
      <template #toast-title>
        <div
          class="d-flex w-100"
          style="cursor: pointer"
          @click="
            isComponent = 'notification';
            $modal.open({ name: 'modal' });
          "
        >
          <b-img src="logo.png" width="20px" rounded="circle" fluid></b-img>
          <strong class="ml-1 text-dark">Next TREND</strong>
          <small class="ml-auto">Just now!</small>
        </div>
      </template>
      <div
        class="d-flex text-dark"
        style="cursor: pointer"
        @click="
          isComponent = 'notification';
          $modal.open({ name: 'modal' });
        "
      >
        <b-img :src="toast.picture" height="50px" rounded="circle"></b-img>
        <p class="ml-2 mb-0">
          <strong>{{ `${toast.name} sent you a friend request.` }}</strong
          ><br />
          <small>Cưới em nhé!</small>
        </p>
      </div>
    </b-toast>
  </b-navbar>
</template>
<script>
import firebase from "firebase/app";

import profile from "~/page_modals/profile";
import settings from "~/page_modals/settings";
import friends from "~/page_modals/friends";
import notification from "~/page_modals/notification";

export default {
  data() {
    return {
      isActive: false,
      isComponent: "",
      logged_id: null,
      logged_user: [],
      toast: []
    };
  },
  components: {
    profile,
    settings,
    friends,
    notification
  },
  created() {
    this.$nuxt.$on("closeModal", () => {
      this.$modal.close({ name: "modal" });
    });
  },
  async mounted() {
    this.logged_id = this.$auth.user.email;
    this.checkExists();
    const search = this.$el.querySelector("#search");
    search.addEventListener("input", () => this.search(search.value));
  },
  methods: {
    checkExists() {
      firebase
        .database()
        .ref("/users")
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            let isExist = false;
            for (let key in data) {
              if (data[key].email === this.$auth.user.email) {
                isExist = true;
              }
            }
            isExist ? this.getloggedUser() : this.save();
          } else {
            this.save();
          }
        });
    },
    save() {
      firebase
        .database()
        .ref("/users")
        .push(this.$auth.user)
        .then(() => this.getloggedUser());
    },
    async search(searchText) {
      firebase
        .database()
        .ref("chat-sections")
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            let section = [];
            for (let key in data) {
              if (data[key].users.includes(this.logged_id)) {
                section.push({ ...data[key], request_id: key });
              }
            }
            let matches = section.filter(item => {
              const regex = new RegExp(`${searchText.toLowerCase()}`, "g");
              return item.name.toLowerCase().match(regex);
            });
            if (searchText.length === 0) {
              matches = [];
              this.$el.querySelector("#htmlOut").innerHTML = "";
            }
            this.outputHTML(matches);
          }
        });
    },
    outputHTML(matches) {
      if (matches.length > 0) {
        const html = matches
          .map(
            item => `
          <div class="f-flex flex-column p-2" data-value="${item.request_id}">
          <div style="padding: 0 5px; cursor: pointer; font-weight: bold">
                <img style="width: 2rem; border-radius: 50%"
                  src="${item.avatar[0]}"/>
              ${item.name}
            </div>
          </div>

        `
          )
          .join("");
        this.$el.querySelector("#htmlOut").innerHTML = html;
        this.$el.querySelectorAll("#htmlOut > div").forEach(item => {
          item.addEventListener("click", () => {
            this.handler(item.getAttribute("data-value"));
          });
        });
      }
    },
    handler(payload) {
      $nuxt.$emit("loadOnSearch", payload);
      this.$el.querySelector("#htmlOut").innerHTML = "";
    },
    async getloggedUser() {
      firebase
        .database()
        .ref("/users")
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
              if (data[key].email === this.logged_id) {
                this.logged_user.push({ ...data[key], request_id: key });
              }
            }
            this.getNotification();
          }
        });
    },
    openModal(name) {
      this.$modal.open({ name: "modal" });
      this.isComponent = name;
    },
    closeModal() {
      this.$modal.close({ name: "modal" });
    },
    getNotification() {
      const el = this.$el.querySelector("#noti");
      firebase
        .database()
        .ref(`users/${this.logged_user[0].request_id}/friends`)
        .on("value", snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            let length = 0;
            for (let key in data) {
              if (data[key].status === 0 && data[key].from != this.logged_id) {
                length++;
                if (data[key].isNew) {
                  this.makeToast({ ...data[key], request_id: key });
                }
              }
            }
            el.innerHTML = length || "";
          } else {
            el.innerHTML = "";
          }
        });
    },
    makeToast(data) {
      this.toast = data;
      // const h = this.$createElement;
      // const vNodesTitle = h(
      //   "div",
      //   { class: ["d-flex w-100"] },[
      //     (h("b-img", {
      //       props: {
      //         src: "logo.png",
      //         width: "20px",
      //         rounded: "circle",
      //         fluid: true
      //       }
      //     }),
      //     h("strong", { class: ["ml-1", "text-dark"] }, "Next TREND"),
      //     h("small", { class: ["ml-auto"] }, "Just now!"))
      //   ]
      // );
      // const vNodesMsg = h("div", { class: ["d-flex text-dark"] }, [
      //   h("b-img", {
      //     props: {
      //       src: data.picture,
      //       height: "50px",
      //       rounded: "circle"
      //     }
      //   }),
      //   h("p", { class: ["mb-0 ml-2"] }, [
      //     h("strong", `${data.name} sent you a friend request.`),
      //     h("br"),
      //     h("small", "Cưới em nhé!")
      //   ])
      // ]);
      this.$bvToast.show("my-toast");
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 10vh;
  background-color: #fffffc !important;
  .brand {
    color: #69daab;
  }
  .search {
    input {
      border-radius: 2rem;
    }
  }
  .home {
    .b-icon {
      cursor: pointer;
    }
    .profile {
      border-radius: 1em;
      transition: 0.3s;
      &:hover {
        background-color: #d3d6df;
        cursor: pointer;
      }
      span {
        display: inline-block;
        margin-right: 0.7em;
        font-weight: bolder;
      }
    }
  }
}
.active {
  transform: translateX(0%) !important;
}
.border-bottom {
  border-bottom: none;
  box-shadow: 0 0 3px #d3d6df;
}

.form-control:focus {
  box-shadow: none;
  border: 1px solid #41b883;
}
.btn-secondary:focus {
  box-shadow: none;
}

.right {
  right: 1rem;
}
.center {
  right: 500px;
}
</style>
