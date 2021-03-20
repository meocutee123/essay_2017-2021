<template>
  <div class="sticky-top">
    <b-navbar
      class="header border-bottom"
      toggleable="lg"
      type="dark"
      variant="light"
    >
      <b-navbar-brand class="d-flex">
        <svg
          class="NuxtLogo"
          width="2em"
          viewBox="0 0 452 342"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M139 330l-1-2c-2-4-2-8-1-13H29L189 31l67 121 22-16-67-121c-1-2-9-14-22-14-6 0-15 2-22 15L5 303c-1 3-8 16-2 27 4 6 10 12 24 12h136c-14 0-21-6-24-12z"
            fill="#00C58E"
          />
          <path
            d="M447 304L317 70c-2-2-9-15-22-15-6 0-15 3-22 15l-17 28v54l39-67 129 230h-49a23 23 0 0 1-2 14l-1 1c-6 11-21 12-23 12h76c3 0 17-1 24-12 3-5 5-14-2-26z"
            fill="#108775"
          />
          <path
            d="M376 330v-1l1-2c1-4 2-8 1-12l-4-12-102-178-15-27h-1l-15 27-102 178-4 12a24 24 0 0 0 2 15c4 6 10 12 24 12h190c3 0 18-1 25-12zM256 152l93 163H163l93-163z"
            fill="#2F495E"
          />
        </svg>
        <div class="brand ml-1">
          <span class="h6">b</span>
          <span class="h5">l</span>
          <span class="h3">i</span>
          <span class="h4">n</span>
          <span class="h5">k</span>
        </div>
      </b-navbar-brand>
      <div class="search ml-auto d-flex">
        <b-input-group>
          <b-form-input placeholder="Type to search for chat"></b-form-input>
        </b-input-group>
        <div
          class="hamburger ml-3"
          @click="isActive = !isActive"
        >
          <b-icon icon="list" scale="1.5rem"></b-icon>
        </div>
      </div>
      <div
        :class="[{active: isActive},'home ml-auto d-flex justify-content-between align-items-center']"
      >
        <div id="home">
          <b-icon icon="house-door" aria-hidden="true" scale="1.2rem"></b-icon>
          <b-tooltip target="home" triggers="hover">Home</b-tooltip>
        </div>
        <div id="friend-request">
          <div>
            <b-icon
              icon="person-plus"
              aria-hidden="true"
              scale="1.2rem"
            ></b-icon>
            <b-badge class="badge" variant="danger">99</b-badge>
          </div>
          <b-tooltip target="friend-request" triggers="hover"
            >Friend requests</b-tooltip
          >
        </div>
        <div id="notification">
          <div>
            <b-icon icon="bell" aria-hidden="true" scale="1.2rem" />
            <b-badge class="badge" variant="danger">4</b-badge>
          </div>
          <b-tooltip target="notification" triggers="hover"
            >Notification</b-tooltip
          >
        </div>
        <div>
          <button pill class="btn_lv1">
            <b-avatar
              variant="danger"
              size="2em"
              src="https://placekitten.com/300/300"
            ></b-avatar
            ><span class="ml-2">Nguyen</span>
          </button>
          <b-button
            pill
            class="btn-light-grey"
            v-b-tooltip.hover
            title="Settings"
            ><b-icon
              icon="caret-up-fill"
              font-scale=".8"
              aria-hidden="true"
              flip-h
              flip-v
            ></b-icon
          ></b-button>
        </div>
      </div>
    </b-navbar>
  </div>
</template>
<script>
export default({
  data() {
    return{
      isActive: false
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  .brand {
    color: #4fc08d;
  }
  .search {
    input {
      border-radius: 2rem;
    }
  }
  .hamburger {
    align-self: center;
    display: none;
    cursor: pointer;
  }
  .home {
    width: 50%;
    .b-icon {
      cursor: pointer;
    }
  }
}
.active{
  transform: translateX(0%) !important;
}
.border-bottom {
  border-bottom: none;
  box-shadow: 0 0 3px #d3d6df;
}

.form-control:focus {
  box-shadow: none;
  border: 1px solid #41b883;
}
.btn-secondary:focus {
  box-shadow: none;
}
.badge {
  position: relative;
  top: -10px;
  left: -10px;
}

@media only screen and (max-width: 768px) {
  .hamburger {
    display: block !important;
  }
  .home {
    flex-direction: column-reverse;
    position: fixed;
    background-color: #c2ffe3;
    height: calc(100% - 60px);
    width: 250px !important;
    top: 60px;
    padding: 2rem 0;
    right: 0;
    transform: translateX(100%);
    // transition: 0.5s ease-in;
  }
}
</style>
