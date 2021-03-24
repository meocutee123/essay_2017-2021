<template>
  <div>
    <div class="header">
      <img src="/cover.jpg" alt="" />
      <div class="avatar">
        <b-avatar src="/nayeon.jpg" size="6rem"></b-avatar>
      </div>
    </div>

    <div class="details">
      <div class="row justify-content-center">
        <button class="col-8">
          <b-icon class="mr-3" icon="plus-circle-fill"></b-icon>Edit profile</button
        ><button class="col-1 ml-2">
          <b-icon icon="three-dots"></b-icon>
        </button>
      </div>
      <div class="infor d-flex flex-column p-4 justify-content-between">
        <p>
          <b-icon icon="house-door-fill" class="mr-2"></b-icon>123 Wasinton St,
          New York
        </p>
        <p><b-icon icon="heart" class="mr-2"></b-icon>Single</p>
        <p><b-icon icon="people-fill" class="mr-2"></b-icon>123 friends</p>
      </div>
    </div>
  </div>
</template>

<script>
import new_conversation from "../page_modals/new_conversation.vue";
export default {
  components: { new_conversation }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  img {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    opacity: 0.6;
  }
  .avatar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
  }
}
.details {
  margin-top: 80px;
  .row {
    button {
      border: none;
      outline: none;
      border-radius: 5px;
      &:nth-child(1) {
        background-color: #ffadad;
        font-weight: bolder;
      }
      &:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .infor {
    width: 100%;
    height: 170px;
    p {
      font-weight: bold;
    }
  }
}
</style>
