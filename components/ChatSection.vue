<template>
  <div class="chat-section mt-auto px-3">
    <slot name="greetings"></slot>
    <div
      v-for="(content, index) in messages"
      :key="index"
      class="conversations d-flex align-items-end flex-column p-2 ml-auto"
    >
      <div class="content">
        <div>{{ content.content }}</div>
      </div>
      <b-avatar class="to" size="1rem"></b-avatar>
    </div>
    <!-- <div class="conversations d-flex align-items-start flex-column p-2">
      <div class="content">
        <div>Lorem ipsum dolor sit amet.</div>
      </div>
      <div class="content">
        <div>Lorem, ipsum dolor.</div>
      </div>
      <div class="content">
        <div>
          Lorem ipsum dolor sit amet consectetur, adipisici elit. Perspiciatis,
          suscipit!
        </div>
      </div>
      <b-avatar class="from" size="1rem"></b-avatar>
    </div>
    <div class="conversations d-flex align-items-end flex-column p-2 ml-auto">
      <div class="content">
        <div>Lorem ipsum dolor sit amet.</div>
      </div>
      <div class="content">
        <div>Lorem, ipsum dolor.</div>
      </div>
      <b-avatar class="to" size="1rem"></b-avatar>
    </div>
    <div class="conversations d-flex align-items-start flex-column p-2">
      <div class="content">
        <div>Lorem ipsum dolor sit amet.</div>
      </div>
      <b-avatar class="from" size="1rem"></b-avatar>
    </div> -->
    <div class="bottom"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  async mounted() {
    await this.$store.dispatch("getMessages");
    this.scrollToElement();
  },
  methods: {
    scrollToElement() {
      const el = this.$el.getElementsByClassName("bottom")[0];

      if (el) {
        // Use el.scrollIntoView() to instantly scroll to the element
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  },
  computed: {
    ...mapState(["messages"])
  }
};
</script>

<style lang="scss" scoped>
.chat-section {
  position: absolute;
  width: 100%;
  bottom: 3.5rem;
  background-color: #fff7f6;
  height: calc(100% - 56px);
  overflow-y: scroll;
  border-radius: 5px;
  .conversations {
    max-width: 400px;
    position: relative;
    .b-avatar {
      position: absolute;
      bottom: 1.3rem;
    }
    .to {
      right: -0.8rem;
    }
    .from {
      left: -0.8rem;
    }
    .content {
      div {
        display: inline-block;
        // layout
        position: relative;
        max-width: 30em;
        margin-bottom: 0.7rem !important;
        // looks
        background-color: #ffadad;
        padding: 0.5em 1em;
        font-size: 1em;
        border-radius: 1rem;
      }
    }
  }
}
</style>
