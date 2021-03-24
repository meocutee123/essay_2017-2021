<template>
  <div class="app">
    <NavHead/>
   <div class="main">
     <nuxt @closeModal="onClickOutside"/>
   </div>
  </div>
</template>
<script>
export default {
   methods: {
    onClickOutside() {
      $nuxt.$emit('closeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  width: 100%;
  height: calc(100vh - 60px);
}
</style>
