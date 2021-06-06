<template>
  <div class="d-flex paticipants flex-column">
    <span class="floating-btn" @click="addParicipant()">ADD</span>
    <b-modal size="sm" hide-footer hide-header id="modal-add">
      <div style="position: relative" class="d-flex align-items-center px-2">
        <b-icon icon="search" class="icon-search"></b-icon>
        <input
          type="text"
          placeholder="Search for friends"
          class="search-chats w-100"
          @input="search($event.target.value)"
        />
      </div>
      <template v-for="(people, index) in temp">
        <b-form-checkbox-group
          v-model="selected"
          class="d-flex mt-2 align-items-center"
          :key="index"
        >
          <b-avatar size="2.3rem" :src="people.picture"></b-avatar>
          <div class="ml-2">
            <h6>{{ people.name }}</h6>
          </div>
          <b-form-checkbox :value="`${people.email}`" class="ml-auto">
          </b-form-checkbox>
        </b-form-checkbox-group>
      </template>
    </b-modal>
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
          <b-avatar
            class="mr-2"
            :src="`${participant.picture}`"
            size="4rem"
          ></b-avatar>
          <div class="d-flex flex-column p-2">
            <h5 class="font-weight-bold">
              {{ `${participant.name}` }}
            </h5>
            <span>{{
              participant.email !== logged_id ? "Someone's wife" : "You"
            }}</span>
          </div>
          <b-icon
            v-if="participant.email !== logged_id"
            icon="x"
            scale="2.3rem"
            @click="removePaticipant(participant.request_id, index)"
          ></b-icon>
        </div>
      </div>
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
      logged_id: null,
      isLoading: false,
      selected: [], temp: []
    };
  },
  async mounted() {
    this.isLoading = true;
    this.logged_id = window.localStorage.getItem("logged_id");
    await this.$axios
      .get(`chat-sections/${this.sectionID}.json`, { progress: false })
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
            this.participants.forEach(user => users.push(user.email));
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
       this.isLoading = true;
      const participants = [];
      const listId = this.listUsers.split(",");
      await this.$axios.get(`users/.json`, { progress: false }).then(res => {
        for (let [, value] of Object.entries(res.data)) {
          if (listId.includes(value.email)) {
            participants.push({ ...value });
          } else {
            this.outnumbers.push(value);
          }
        }
      });
       this.isLoading = false;
      this.participants = participants;
    },
    async addParicipant() {
      this.$bvModal.show("modal-add");
    },
    search(searchTex) {
      const temp =JSON.parse(JSON.stringify(this.participants))
      let matches = temp.filter(user => {
        const regex = new RegExp(`^${searchTex}`, "gi");
        return user.name.match(regex) || user.email.match(regex);
      });
      if (searchTex.length == 0) {
        return;
      }
      this.temp = matches;
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
.icon-search {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translate(-20%, -50%);
}
.search-chats {
  background-color: #f0f2f5;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  padding: 0.4rem 0 0.4rem 28px;
}
</style>
