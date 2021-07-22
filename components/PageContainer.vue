<template>
  <div id="app" class="d-flex">
    <div class="side-bar">
      <slot name="sidebar"></slot>
    </div>
    <div class="chat-area" @click="onClickOutside">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onClickOutside() {
      $nuxt.$emit("closeModal");
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  box-sizing: border-box;
  height: 90vh;
  .side-bar {
    width: 330px;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #e4e6eb;

  }
  .chat-area {
    width: 100%;
    height: 100%;
    border: 1px solid #e4e6eb;
    border-left: 0;
    box-sizing: border-box;
  }
}
</style>
