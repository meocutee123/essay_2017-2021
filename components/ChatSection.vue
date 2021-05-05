<template>
  <div class="chat-section mt-auto px-3">
    <slot v-if="!defaultView" name="greetings"></slot>
    <div v-if="defaultView">
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Text slides with image -->
        <b-carousel-slide
          caption="First slide"
          text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          img-src="https://picsum.photos/1024/480/?image=52"
        ></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
          <h1>Hello world!</h1>
        </b-carousel-slide>

        <!-- Slides with image only -->
        <b-carousel-slide
          img-src="https://picsum.photos/1024/480/?image=58"
        ></b-carousel-slide>

        <!-- Slides with img slot -->
        <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
        <b-carousel-slide>
          <template #img>
            <img
              class="d-block img-fluid w-100"
              width="1024"
              height="480"
              src="https://picsum.photos/1024/480/?image=55"
              alt="image slot"
            />
          </template>
        </b-carousel-slide>

        <!-- Slide with blank fluid image to maintain slide aspect ratio -->
        <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            eros felis, tincidunt a tincidunt eget, convallis vel est. Ut
            pellentesque ut lacus vel interdum.
          </p>
        </b-carousel-slide>
      </b-carousel>
    </div>
    <div
      v-else
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
  props: ["isNew"],
  data() {
    return {
      defaultView: true,
      slide: 0,
      sliding: null
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch("getMessages");
    this.isLoading = false;
    this.scrollToElement();
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
    async onDelete(id) {
      await this.$store.dispatch("deleteMessage", id);
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
  background-color: #e3fff2;
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
        background-color: #41b883;
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
