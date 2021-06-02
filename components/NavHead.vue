<template>
  <b-navbar
    class="header border-bottom d-flex justify-content-between py-0"
    toggleable="lg"
    type="dark"
    variant="light"
  >
    <b-navbar-brand class="d-flex">
      <img src="/logo.png" alt="logo" style="max-height: 33px" />
      <div class="brand ml-1">
        <span class="h6">n</span>
        <span class="h5">e</span>
        <span class="h4">x</span>
        <span class="h3">t</span>
        <span class="h2" style="color: black; font-weight: bold">TREND</span>
      </div>
    </b-navbar-brand>
    <div class="search d-flex">
      <b-input-group style="position: relative">
        <b-form-input
          id="search"
          placeholder="Type to search for chat"
        ></b-form-input>
      </b-input-group>
      <div
        style="z-index: 1000;position: absolute; color: #273849; background: #06d6a0; top: 3.3rem; width: 200px; border-radius: .5rem"
        id="htmlOut"
      ></div>
    </div>
    <div :class="[{ active: isActive }, 'home d-flex align-items-center']">
      <div @click="openModal('profile')" class="profile">
        <b-avatar
          variant="danger"
          size="2rem"
          src="https://placekitten.com/300/300"
        ></b-avatar
        ><span>{{ logged_user[0] && logged_user[0].name.firstName }}</span>
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
        <component :is="isComponent"></component>
      </v-modal>
    </div>
  </b-navbar>
</template>
<script>
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
      logged_user: []
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
    this.logged_id = window.localStorage.getItem("logged_id");
    await this.getloggedUser();
    const search = this.$el.querySelector("#search");
    search.addEventListener("input", () => this.search(search.value));
    // this.getNotification();
  },
  methods: {
    async search(searchText) {
      await this.$axios
        .get("chat-sections.json", { progress: false })
        .then(({ data }) => {
          let section = [];
          for (let key in data) {
            section.push({ ...data[key], request_id: key });
          }
          let matches = section.filter(item => {
            const regex = new RegExp(`^${searchText}`, "gi");
            return item.name.match(regex);
          });
          if (searchText.length === 0) {
            matches = [];
            this.$el.querySelector("#htmlOut").innerHTML = "";
          }
          this.outputHTML(matches);
        });
    },
    outputHTML(matches) {
      if (matches.length > 0) {
        const html = matches
          .map(
            item => ` <div class="f-flex flex-column p-2" data-value="${item.request_id}">
          <div style="border-bottom: 1px solid #f8f9fa; padding: 0 5px; cursor: pointer ">${item.name}</div>
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
      await this.$axios.get(`users.json`).then(({ data }) => {
        for (let i in data) {
          if (data[i].id === this.logged_id) {
            this.logged_user.push({ ...data[i], request_id: i });
          }
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
      setInterval(async () => {
        await this.$axios
          .get(`users/${this.logged_user[0].request_id}.json`, {
            progress: false
          })
          .then(response => {
            if (response.data.requests) {
              let length = Object.keys(response.data.requests).length;
              if (length) {
                this.$el.querySelector("#noti").innerHTML = length;
              } else {
                this.$el.querySelector("#noti").innerHTML = "";
              }
            }
          });
      }, 10000);
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 10vh;
  background-color: #fffffc !important;
  .brand {
    color: #fec5bb;
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
