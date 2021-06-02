<template>
  <client-only>
    <page-container>
      <template v-slot:sidebar>
        <SideBar @openChatSection="openChatSection" />
      </template>

      <!-- <template v-slot:friends>
        <div class="side-header d-flex">
          <span>Online friends</span>
        </div>

        <div class="chats d-flex flex-column ???">
          <div v-if="isLoading" class="user d-flex my-3 ml-2">
            <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
            <div style="width: 80%" class="ml-3 mt-2">
              <b-skeleton animation="wave" width="90%"></b-skeleton>
              <b-skeleton
                animation="wave"
                class="mt-2"
                width="55%"
              ></b-skeleton>
            </div>
          </div>
          <div v-if="isLoading" class="user d-flex my-3 ml-2">
            <b-skeleton width="65px" height="60px" type="avatar"></b-skeleton>
            <div style="width: 80%" class="ml-3 mt-2">
              <b-skeleton animation="wave" width="90%"></b-skeleton>
              <b-skeleton
                animation="wave"
                class="mt-2"
                width="55%"
              ></b-skeleton>
            </div>
          </div>
          <div
            v-for="(friend, index) in friends"
            :key="index"
            class="user d-flex my-1 ml-2 align-items-center"
          >
            <b-avatar width="65px" height="60px"></b-avatar>
            <div style="width: 80%" class="ml-3 mt-2">
              <h4 class="font-weight-bold">
                {{ `${friend.name.firstName} ${friend.name.lastName}` }}
              </h4>
              <small class="text-success">Online</small>
            </div>
          </div>
        </div>
      </template> -->
      <ChatSection ref="chatSection" :sectionData="sectionData" />
    </page-container>
  </client-only>
</template>

<script>
export default {
  loading: false,
  // middleware: "auth",
  data() {
    return {
      onFocus: false,
      email: "",
      password: "",
      isDefaultView: true,
      chatSections: [],
      sectionData: {},
      logged_id: null,
      isLoading: false,
      friends: [],
      isLoadingSection: false
    };
  },
  methods: {
    async onCreate(payload) {
      await this.getData();
      const index = this.chatSections.findIndex(
        section => section.id === payload[0].request_id
      );
      const el = this.$refs[`section-${index}`][0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      if (payload) {
        await this.openChatSection(payload[0].request_id);
      }
    },
    openChatSection(payload) {
      this.sectionData = payload;
      this.$refs.chatSection.isActive = false;
      this.$refs.chatSection.getData();
    }
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
      small {
        text-overflow: ellipsis;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
      }
      .active {
        color: #273849;
        font-weight: bold;
      }
    }
  }
}

.btn-light-grey {
  color: #111111;
  font-weight: bold;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
}
.onActive {
  background-color: #c6e3ff;
}
</style>
