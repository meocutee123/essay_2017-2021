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
          @change="onChange($event)"
        ></b-form-input>
        <datalist id="people">
          <option v-for="(people, index) in names" :key="index">{{
            people
          }}</option>
        </datalist>
      </div>
      <div class="selected mb-1">
        <span class="mr-1" v-for="(value, index) in values" :key="index"
          >{{ value
          }}<b-icon icon="x" scale="1.5rem" @click="onDelete(index)"></b-icon
        ></span>
      </div>
      <div class="chat-area">
        <!-- <ChatSection :isNew="true" /> -->
        <Playground @sent="newConversation" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      values: [],
      users: [],
      names: [],
      listUsers: []
    };
  },
  mounted() {
    this.getUsers();
    this.listUsers.push(localStorage.getItem("loged-id"));
  },
  methods: {
    async getUsers() {
      await this.$axios.get("/users.json").then(response => {
        for (let index in response.data) {
          if (response.data[index].id === localStorage.getItem("loged-id"))
            continue;
          let { name } = response.data[index];
          this.names.push(`${name.firstName} ${name.lastName}`);
          this.users.push({
            ...response.data[index],
            name: `${name.firstName} ${name.lastName}`
          });
        }
      });
    },
    onChange(e) {
      this.values.push(e);
      this.listUsers.push(this.users.find(item => item.name === e).id);
    },
    onDelete(index) {
      this.values.splice(index, 1);
      this.listUsers.splice(index + 1, 1);
    },
    async newConversation(content) {
      if (this.listUsers.length === 1) return;
      await this.$axios
        .post(
          "/chat-sections.json",
          JSON.stringify({
            users: this.listUsers.join(","),
            name: this.values.join(", ")
          })
        )
        .then(response => {
          console.log(response);
          this.$axios
            .patch(`messages/${content.id}.json`, {
              chat_section: response.data.name
            })
            .catch(err => console.log(err));
        });
    }
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
