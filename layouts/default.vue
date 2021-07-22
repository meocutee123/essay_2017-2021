<template>
  <div>
    <div class="app" v-if="!isMobile">
    <NavHead />
    <div class="main">
      <nuxt @closeModal="onClickOutside" />
    </div>
  </div>
  <Error v-else/>
  </div>
</template>
<script>
import NavHead from "~/components/NavHead";
import Error from "~/components/Error";
export default {
  components: { NavHead, Error },
  data(){
    return{
      isMobile: false
    }
  },
    created(){
    window.addEventListener('resize', this.checkScreen)
  },
  methods: {
    onClickOutside() {
      $nuxt.$emit("closeModal");
    },
    checkScreen(){
      if(window.innerWidth < 800){
        this.isMobile = true
      }else{
        this.isMobile = false
      }
    }
  },

};
</script>

<style lang="scss" scoped>
  
</style>
