<template>
  <div class="play-ground d-flex">
    <div
      class=" pg-actions d-flex justify-content-between align-items-center mb-2"
    >
      <b-icon icon="image" scale="1.3rem"></b-icon>
      <b-icon icon="share-fill" scale="1.3rem"></b-icon>
      <b-icon icon="mic-fill" scale="1.3rem"></b-icon>
    </div>
    <div class="message d-flex">
      <div class="text">
        <textarea
          rows="2"
          placeholder="Type a message"
          @focus="onFocus = true"
          @blur="onfocus = false"
          v-model="content"
          @keyup.enter.exact="onClickSend()"
        ></textarea>
        <b-icon
          class="icon-smile"
          icon="emoji-smile-fill"
          scale="1.4rem"
        ></b-icon>
      </div>
      <b-icon
        @click="onClickSend()"
        class="focus-icon mt-2 ml-3"
        :icon="onFocus ? 'cursor-fill' : 'heart-fill'"
        scale="1.4rem"
      ></b-icon>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      onFocus: false,
      content: ""
    };
  },
  methods: {
    onClickSend() {
      this.$emit("onClickSend", {
        content: this.content
      });
      this.content = ''
    }
  }
};
</script>

<style lang="scss" scoped>
.play-ground {
  max-height: 3.5rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  .pg-actions {
    color: #41b883;
    padding: 5px 15px 5px 10px;
    min-width: 150px;
    transition: 0.2s;
    .b-icon {
      &:hover {
        cursor: pointer;
        color: #fec5bb;
      }
    }
  }
  .message {
    width: inherit;
    .text {
      width: 93%;
      position: relative;
      textarea {
        width: 100%;
        height: 2rem !important;
        border-radius: 2rem;
        outline: none;
        border: none;
        background-color: #41b883;
        resize: none;
        padding-left: 0.5rem;
        color: #273849;
        font-size: 1rem;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .icon-smile {
        position: absolute;
        color: #41b883;
        top: 0.5rem;
        right: 0.5rem;
        transition: 0.2s;
        &:hover {
          cursor: pointer;
          color: #98dfbf;
        }
      }
    }
    .focus-icon {
      color: #41b883;
      transition: 0.2s;
      &:hover {
        cursor: pointer;
        color: #98dfbf;
      }
    }
  }
}
</style>
