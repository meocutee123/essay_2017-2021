<template>
  <div class="sticky-top">
    <b-navbar
      class="header border-bottom"
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
      <div class="search ml-auto d-flex">
        <b-input-group>
          <b-form-input placeholder="Type to search for chat"></b-form-input>
        </b-input-group>
        <div class="hamburger ml-3" @click="isActive = !isActive">
          <b-icon icon="list" scale="1.5rem"></b-icon>
        </div>
      </div>
      <div
        :class="[
          { active: isActive },
          'home ml-auto d-flex align-items-center'
        ]"
      >
        <div @click="openModal('profile')" class="profile">
          <b-avatar
            variant="danger"
            size="2rem"
            src="https://placekitten.com/300/300"
          ></b-avatar
          ><span>Nguyen</span>
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
          <b-badge class="badge" variant="danger">4</b-badge>
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
      </div>
    </b-navbar>
    <v-modal name="modal">
      <component :is="isComponent"></component>
    </v-modal>
  </div>
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
      isComponent: ""
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
  mounted() {
    this.getLogedUser();
  },
  methods: {
    async getLogedUser() {
      await this.$axios.get(`users.json`).then(({ data }) => {
        for (let index in data) {
          data[index].id === window.localStorage.getItem("loged-id") &&
            this.$axios
              .get(`users/${index}.json`)
              .then();
        }
      });
    },
    openModal(name) {
      this.$modal.open({ name: "modal" });
      this.isComponent = name;
    },
    closeModal() {
      this.$modal.close({ name: "modal" });
    }
  },
  computed: {
    userLoged() {
      window.localStorage.getItem("loged-id");
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background-color: #fffffc !important;
  .brand {
    color: #fec5bb;
  }
  .search {
    input {
      border-radius: 2rem;
    }
  }
  .hamburger {
    align-self: center;
    display: none;
    cursor: pointer;
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

@media only screen and (max-width: 940px) {
  .hamburger {
    display: block !important;
  }
  .home {
    flex-direction: column-reverse;
    position: fixed;
    background-color: #ffd7ba;
    height: calc(100% - 60px);
    width: 250px !important;
    top: 60px;
    padding: 2rem 0;
    right: 0;
    transform: translateX(100%);
    // transition: 0.5s ease-in;
  }
}
</style>
