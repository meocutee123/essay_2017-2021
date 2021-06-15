<template>
  <client-only>
    <page-container>
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
