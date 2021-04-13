<template>
  <div class="chat-section mt-auto px-3">
    <slot name="greetings"></slot>
    <div
      v-for="(content, index) in messages"
      :key="index"
      class="conversations d-flex align-items-end flex-column p-2 ml-auto"
    >
      <div class="content">
        <div class="message">{{ content.content }}</div>
        <div class="actions">
          <b-icon icon="three-dots"></b-icon>
          <div class="action d-flex flex-column">
            <span @click="onDelete(content.id)">Delete</span>
          </div>
        </div>
      </div>
      <b-avatar class="to" size="1rem"></b-avatar>
    </div>
    <!-- Loading -->
    <div
      v-if="isLoading"
      class="conversations d-flex align-items-end flex-column p-2 ml-auto"
    >
      <b-skeleton animation="fade" width="85%" height="3rem"></b-skeleton>
      <b-skeleton animation="fade" width="55%"></b-skeleton>
      <b-skeleton animation="fade" width="70%"></b-skeleton>
    </div>
    <div
      v-if="isLoading"
      class="conversations d-flex align-items-end flex-column p-2 ml-auto"
    >
      <b-skeleton animation="fade" width="65%"></b-skeleton>
      <b-skeleton animation="fade" width="5%"></b-skeleton>
      <b-skeleton animation="fade" width="20%"></b-skeleton>
    </div>
    <div
      v-if="isLoading"
      class="conversations d-flex align-items-end flex-column p-2 ml-auto"
    >
      <b-skeleton animation="fade" width="35%" height="2rem"></b-skeleton>
      <b-skeleton animation="fade" width="95%"></b-skeleton>
      <b-skeleton animation="fade" width="90%"></b-skeleton>
    </div>
    <div
      v-if="isLoading"
      class="conversations d-flex align-items-end flex-column p-2 ml-auto"
    >
      <b-skeleton animation="fade" width="85%" height="3rem"></b-skeleton>
      <b-skeleton animation="fade" width="55%"></b-skeleton>
      <b-skeleton animation="fade" width="70%"></b-skeleton>
    </div>
    <div
      v-if="isLoading"
      class="conversations d-flex align-items-end flex-column p-2 ml-auto"
    >
      <b-skeleton animation="fade" width="65%"></b-skeleton>
      <b-skeleton animation="fade" width="5%"></b-skeleton>
      <b-skeleton animation="fade" width="20%"></b-skeleton>
    </div>
    <!-- <div class="conversations d-flex align-items-start flex-column p-2">
      <div class="content">
        <div class="message">Lorem ipsum dolor sit amet.</div>
      </div>
      <div class="content">
        <div class="message">Lorem, ipsum dolor.</div>
      </div>
      <div class="content">
        <div class="message">
          Lorem ipsum dolor sit amet consectetur, adipisici elit. Perspiciatis,
          suscipit!
        </div>
      </div>
      <b-avatar class="from" size="1rem"></b-avatar>
    </div>
    <div class="conversations d-flex align-items-end flex-column p-2 ml-auto">
      <div class="content">
        <div class="message">Lorem ipsum dolor sit amet.</div>
      </div>
      <div class="content">
        <div class="message">Lorem, ipsum dolor.</div>
      </div>
      <b-avatar class="to" size="1rem"></b-avatar>
    </div>
    <div class="conversations d-flex align-items-start flex-column p-2">
      <div class="content">
        <div class="message">Lorem ipsum dolor sit amet.</div>
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
    return {
      isLoading: false
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch("getMessages").then(() => {
      this.isLoading = false;
    });
    this.scrollToElement();
  },
  methods: {
    async onDelete(id) {
      await this.$store.dispatch("deleteMessage", id);
      console.log("done");
    },
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
      position: relative;
      .message {
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
      .actions {
        position: absolute;
        left: -20px;
        transform: translate(-50%, -50%);
        top: 40%;
        .action {
          position: absolute;
          top: 40%;
          transform: translate(-50%, -50%);
          display: none !important;
          padding: 0.2em;
          span:hover {
            display: inline-block;
            padding: 3px;
            border-radius: 3px;
            background-color: #ddd;
          }
        }
        &:hover {
          cursor: pointer;
          .action {
            display: block !important;
          }
        }
      }
    }
  }
}
</style>
