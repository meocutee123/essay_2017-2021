<template>
  <div class="app">
    <NavHead />
    <div class="main">
      <nuxt @closeModal="onClickOutside" />
    </div>
  </div>
</template>
<script>
import NavHead from "~/components/NavHead";
export default {
  components: { NavHead },
  methods: {
    onClickOutside() {
      $nuxt.$emit("closeModal");
    }
  }
};
</script>

<style lang="scss" scoped>
  
</style>
