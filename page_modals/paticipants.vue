<template>
  <div class="d-flex paticipants flex-column">
    <span class="floating-btn">ADD</span>
    <h3>Paticipants</h3>
    <div class="d-flex flex-column">
      <div v-if="isLoading" class="people p-3 d-flex flex-column">
        <div class="person d-flex">
          <b-skeleton width="70px" height="70px" type="avatar"></b-skeleton>
          <div class="d-flex flex-column p-2">
            <h5>
              <b-skeleton animation="wave" width="200px"></b-skeleton>
            </h5>
            <span><b-skeleton animation="wave" width="20%"></b-skeleton></span>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="people p-3 d-flex flex-column">
        <div class="person d-flex">
          <b-skeleton width="70px" height="70px" type="avatar"></b-skeleton>
          <div class="d-flex flex-column p-2">
            <h5>
              <b-skeleton animation="wave" width="200px"></b-skeleton>
            </h5>
            <span><b-skeleton animation="wave" width="20%"></b-skeleton></span>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="people p-3 d-flex flex-column">
        <div class="person d-flex">
          <b-skeleton width="70px" height="70px" type="avatar"></b-skeleton>
          <div class="d-flex flex-column p-2">
            <h5>
              <b-skeleton animation="wave" width="200px"></b-skeleton>
            </h5>
            <span><b-skeleton animation="wave" width="20%"></b-skeleton></span>
          </div>
        </div>
      </div>
      <div class="people p-3 d-flex flex-column">
        <div
          class="person d-flex"
          v-for="(participant, index) in participants"
          :key="index"
        >
          <b-avatar class="mr-2" src="/wendy.jpg" size="4rem"></b-avatar>
          <div class="d-flex flex-column p-2">
            <h5 class="font-weight-bold">
              {{ `${participant.name.firstName} ${participant.name.lastName}` }}
            </h5>
            <span>{{
              participant.id !== loged_id ? "Someone's wife" : "You"
            }}</span>
          </div>
          <b-icon
            v-if="participant.id !== loged_id"
            icon="x"
            scale="2.3rem"
            @click="removePaticipant(participant.request_id, index)"
          ></b-icon>
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
      participants: [],
      listUsers: "",
      outnumbers: [],
      loged_id: null,
      isLoading: false
    };
  },
  async mounted() {
    this.isLoading = true;
    this.loged_id = window.localStorage.getItem("loged_id");
    await this.$axios
      .get(`chat-sections/${this.sectionID}.json`)
      .then(response => {
        this.listUsers = response.data.users;
      });
    await this.getParticipants();
    this.isLoading = false;
  },
  methods: {
    async removePaticipant(index) {
      this.$swal
        .fire({
          icon: "warning",
          titleText: "Are you sure?",
          timer: "5000",
          allowOutsideClick: true,
          allowEscapeKey: true,
          showConfirmButton: true,
          confirmButtonColor: "#41b883",
          showCancelButton: true
        })
        .then(res => {
          if (res.isConfirmed) {
            this.participants.splice(index, 1);
            const users = [];
            this.participants.forEach(user => users.push(user.id));
            this.$axios
              .patch(
                `/chat-sections/${this.sectionID}.json`,
                JSON.stringify({
                  users: users.join(",")
                })
              )
              .then(res => console.log(res));
          }
        });
    },
    async getParticipants() {
      const participants = [];
      const listId = this.listUsers.split(",");
      await this.$axios.get(`users/.json`).then(res => {
        for (let [, value] of Object.entries(res.data)) {
          if (listId.includes(value.id)) {
            participants.push({ ...value });
          } else {
            this.outnumbers.push(value);
          }
        }
      });
      this.participants = participants;
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
