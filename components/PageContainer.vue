<template>
  <div class="app">
    <div class="chat-app d-flex">
      <div class="side-bar d-flex flex-column">
        <slot name="sidebar"></slot>
        <slot name="friends"></slot>
      </div>
      <div class="chat-area">
        <slot />
      </div>
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.app {
  box-sizing: border-box;
  height: 100%;
  .chat-app {
    height: inherit;
    .side-bar {
      width: 330px;
      height: inherit;
      border: 1px solid #e4e6eb;
    }
    .chat-area{
      width: calc(100% - 330px);
      height: inherit;
    }
  }
}
</style>
