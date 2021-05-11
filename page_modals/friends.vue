<template>
  <div>
    <h3 class="font-weight-bold">People you might know</h3>
    <div class="d-flex search justify-content-start align-items-center">
      <label class="m-0 mr-2" for="search">Find: </label>
      <input id="search" type="text" />
    </div>
    <div class="friends">
      <div
        class="friend d-flex p-2"
        v-for="(person, index) in friends"
        :key="index"
      >
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">{{ person.name.firstName }} {{ person.name.lastName }}</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      friends: []
    };
  },
  async mounted() {
    await this.$axios
      .get("users.json")
      .then(response => {
        const friends = []
        for(let index in response.data){
          if(response.data[index].id === window.localStorage.getItem('loged-id')) continue
          friends.push({...response.data[index]})
        }
        this.friends = friends
      })
      .catch(err => console.log(err));
  }
};
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 0.8em;
  input {
    outline: none;
    border: none;
    border-bottom: 1px solid #e4e6eb;
    margin: 0;
    width: 100%;
  }
}
.friends {
  .friend {
    padding: 0.3em;
    border-radius: 0.7em;
    transition: 0.5s;
    &:hover {
      cursor: pointer;
      background-color: #fff7f6;
    }
    div > p {
      font-size: 0.7em;
      color: #d8dbe0;
    }
  }
}
</style>
