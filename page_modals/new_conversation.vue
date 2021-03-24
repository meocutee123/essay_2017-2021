<template>
  <div class="d-flex flex-column">
    <div class="title">
      <h3>New conversation</h3>
    </div>
    <div class="body">
      <div class="d-flex search-area">
        <span>To: </span>
        <b-form-input
          class="search-people ml-3 w-100 p-1"
          type="text"
          debounce="500"
          list="people"
          v-model="value"
        ></b-form-input>
        <datalist id="people">
          <option v-for="(people, index) in sizes" :key="index">{{
            people
          }}</option>
        </datalist>
      </div>
      <div class="selected mb-1">
        <span class="mr-1"
          >Nghia <b-icon icon="x" scale="1.5rem"></b-icon
        ></span>
        <span class="mr-1">Meo <b-icon icon="x" scale="1.5rem"></b-icon></span>
        <span class="mr-1"
          >Cutee <b-icon icon="x" scale="1.5rem"></b-icon
        ></span>
      </div>
      <div class="chat-area">
        <ChatSection />
        <Playground />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      sizes: ["Small", "Medium", "Large", "Extra Large", "Extra Large"]
    };
  }
};
</script>

<style lang="scss" scoped>
h3 {
  font-weight: bolder;
}
.search-area {
  border-bottom: 1px solid #e4e6eb;
  span {
    font-size: 0.9rem;
  }
  .search-people {
    height: 1.1rem;
    outline: none;
    box-shadow: none;
    border: none;
  }
}
.selected {
  padding-top: 2px;
  span {
    position: relative;
    display: inline-block;
    padding: 0.1rem 0.5rem;
    border: 1px solid #e4e6eb;
    border-radius: 3px;
    transition: 0.2s;
    &:hover {
      cursor: pointer;
      background-color: rgb(247, 208, 255);
    }
    b-icon {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
.chat-area {
  width: 100%;
  height: 40vh;
  position: relative;
}
</style>
