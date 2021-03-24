<template>
  <div modal="true" >
    <div>
      <div :data-modal="name" v-if="isVisible" :class="`custom-modal`">
        <div
          aria-modal="true"
          data-reach-dialog-content="true"
          tabindex="-1"
          class="modal-mask"
        >
          <div class="modal_body">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VModal from "./handle";
export default {
  props: ["name"],
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    open(params) {
      this.isVisible = true;
    },
    close(params) {
      this.isVisible = false;
    }
  },
  beforeMount() {
    VModal.EventBus.$on("open", params => {
      if (this.name === params.name) {
        this.open(params);
      }
    });
    VModal.EventBus.$on("close", params => {
      if (this.name === params.name) {
        this.close(params);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.custom-modal {
  box-sizing: border-box;
  position: fixed;
  top: 56px;
  right: 1rem;
  z-index: 1050;
  overflow: hidden;
  outline: 0;
  width: 350px;
  height: 500px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.4rem;
  outline: 0;
  box-shadow: 2px 3px 3px 3px #e4e6eb;
  overflow-y: scroll;
  .modal_body{
    padding: .8em
  }
}
</style>
