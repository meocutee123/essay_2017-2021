<template>
  <client-only>
    <page-container>
      <!-- <b-button class="floating-btn" v-b-toggle.sidebar-1>
        <b-icon icon="chevron-double-right"></b-icon>
      </b-button> -->
      <template v-slot:sidebar style="z-index: 100">
        <SideBar @openChatSection="openChatSection" />
      </template>
      <component
        :is="activeComponent"
        ref="chatSection"
        :sectionData="sectionData"
      />
    </page-container>
  </client-only>
</template>

<script>
import _chat from "~/components/ChatSection";
import _default from "~/components/Default";
export default {
  middleware: "auth",
  components: {
    "chat-section": _chat,
    "default-section": _default
  },
  data() {
    return {
      sectionData: [],
      activeComponent: "default-section"
    };
  },
  methods: {
    openChatSection(payload) {
      this.sectionData = payload;
      this.activeComponent = "chat-section";
      this.$refs.chatSection.isActive = false;
    }
  }
};
</script>
<style scoped lang="scss">
.floating-btn {
  position: fixed;
  top: 10vh;
  left: 0;
  background: #ebebeb;
  color: #35495e;
  font-weight: bolder;
  border: none;
  &:hover .b-icon {
    animation: custom 0.5s ease-in-out infinite alternate;
  }
}
@keyframes custom {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(0.3rem);
  }
}
</style>
