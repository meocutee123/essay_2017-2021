<template>
  <div class="d-flex paticipants flex-column">
    <span class="floating-btn">ADD</span>
    <h3>Paticipants</h3>
    <div class="d-flex flex-column">
      <div class="people p-3 d-flex flex-column">
        <div class="person d-flex">
          <b-avatar class="mr-2" src="/wendy.jpg" size="4rem"></b-avatar>
          <div class="d-flex flex-column p-2">
            <h5 class="font-weight-bold">Son Seungwan</h5>
            <span>Add by you</span>
          </div>
          <b-icon icon="x" scale="2.3rem"></b-icon>
        </div>
      </div>
      <div class="outnumber"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["sectionID"],
  data() {
    return {
      paticipants: [],
      listUsers: ""
    };
  },
  async mounted() {
    await this.$axios
      .get(`chat-sections/${this.sectionID}.json`)
      .then(response => {
        this.listUsers = response.data.users;
      });
    this.getParticipants();
  },
  methods: {
    async getParticipants() {
      const list = this.listUsers.split(",")
      for (let item in list) {
        await this.$axios.get(`users/${list[item]}.json`).then((res) => {
          console.log(res);
          // for (let i in data) {
          //   this.paticipants.push({ ...data[i], id: i });
          // }
        });
      }
      console.log(this.paticipants);
    }
  }
};
</script>

<style lang="scss" scoped>
.paticipants {
  h3 {
    background: #fff;
    padding: 0.5em;
    font-weight: bold;
  }
  position: relative;
  .floating-btn {
    position: absolute;
    top: 0.5em;
    right: 1rem;
    font-weight: bold;
    font-size: 0.8em;
    &:hover {
      cursor: pointer;
    }
  }
  .person {
    position: relative;
    border-radius: 1rem;
    transition: 0.3s;
    padding: 0.5em;
    &:hover {
      cursor: pointer;
      background-color: #fff7f6;
    }
    .b-icon {
      position: absolute;
      top: 50%;
      right: 10%;
      transform: translate(-50%, -50%);
      transition: 0.4s;
      &:hover {
        color: #35495e;
      }
    }
  }
  .d-flex.flex-column.p-2 span {
    font-size: 0.9em;
    color: #d8dbe0;
  }
}
</style>
