<template>
  <div class="handler d-flex flex-column">
    <h3 class="font-weight-bold">Notifications</h3>
    <div class="d-flex flex-column">
      <h4 class="font-weight-bold">Today</h4>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button v-b-toggle.collapse-1 class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
          <b-collapse id="collapse-1" class="collapse-btn mb-2">
            <button class="mr-3">Accept</button>
            <button>Reject</button>
          </b-collapse>
        </div>
      </div>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button v-b-toggle.collapse-2 class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
          <b-collapse id="collapse-2" class="collapse-btn mb-2">
            <button class="mr-3">Accept</button>
            <button>Reject</button>
          </b-collapse>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column">
      <h4 class="font-weight-bold">Yesterday</h4>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
      <div class="content d-flex">
        <b-avatar size="3rem"></b-avatar>
        <div class="notify ml-3">
          <div class="d-flex">
            <p>
              <span class="font-weight-bold">I'm Nayeon</span> sent you a friend
              request.
            </p>
            <b-button class="btn-light-grey">
              <b-icon icon="three-dots"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.handler {
  height: calc(500px - 0.8 * 17px * 2);
}
.collapse-btn {
  button {
    background-color: #e4e6eb;
    outline: none;
    border: none;
    position: relative;
    padding: 0.2em 0.3em;
    border-radius: 0.8em;
  }
}
</style>
