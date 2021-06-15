<template>
  <div class="d-flex paticipants flex-column">
    <span class="floating-btn" @click="addParicipant()">ADD</span>
    <b-modal size="sm" hide-footer hide-header id="modal-add">
      <div style="position: relative" class="d-flex align-items-center px-2">
        <b-icon icon="search" class="icon-search"></b-icon>
        <input
          type="text"
          placeholder="Search for friends"
          class="search-chats"
          @input="search($event.target.value)"
        />
        <button class="btn-light-grey ml-auto" @click="onSave()">
          <b-icon icon="arrow-right-circle" aria-hidden="true"></b-icon>
        </button>
      </div>
      <template v-for="(people, index) in matches">
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
      <div v-if="isLoading" class="people px-3 d-flex flex-column">
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
      <div v-if="isLoading" class="people px-3 d-flex flex-column">
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
      <div v-if="isLoading" class="people px-3 d-flex flex-column">
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
          <template v-if="host === logged_id">
            <b-icon
              v-if="participant.email !== logged_id"
              icon="x"
              scale="2.3rem"
              @click="removePaticipant(index)"
            ></b-icon>
          </template>
        </div>
      </div>
      <button class="leave" @click="selfLeave()">Leave conversation</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  props: ["sectionID"],
  data() {
    return {
      participants: [],
      listUsers: "",
      outnumbers: [],
      logged_id: null,
      isLoading: false,
      selected: [],
      temp: [],
      host: null,
      matches: []
    };
  },
  async mounted() {
    this.logged_id = this.$auth.user.email;
    firebase
      .database()
      .ref(`chat-sections/${this.sectionID}`)
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.host = data.host;
          this.listUsers = data.users;
        }
      });
    await this.getParticipants();
  },
  methods: {
    async removePaticipant(index, text = "Are you sure?") {
      this.$swal
        .fire({
          icon: "warning",
          titleText: text,
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

            firebase
              .database()
              .ref(`/chat-sections/${this.sectionID}`)
              .update({
                users: [...this.participants.map(item => item.email)]
              })
              .then(
                () =>
                  text !== "Are you sure?" &&
                  (location.reload(), this.$bvModal.hide("paticipants"))
              );
          }
        });
    },
    async getParticipants() {
      const participants = [];
      let outnumbers = [];
      this.participants = [];
      this.isLoading = true;
      firebase
        .database()
        .ref("users")
        .once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
              if (this.listUsers.includes(data[key].email)) {
                participants.push({ ...data[key] });
              }
              if (data[key].email === this.logged_id) {
                outnumbers = data[key].friends;
              }
            }
          }
          this.isLoading = false;
          this.participants = participants;
          this.temp = Object.keys(outnumbers)
            .map(item => outnumbers[item])
            .filter(item => item.status === 1);
          this.search();
        });
    },
    async addParicipant() {
      this.participants = [];
      await this.getParticipants();
      this.$bvModal.show("modal-add");
    },
    search(searchTex = "") {
      const listID = this.participants.map(item => item.email);
      const regex = new RegExp(`^${searchTex}`, "gi");
      let matches = [];
      if (searchTex.length === 0) {
        this.temp.forEach(item => {
          if (!listID.includes(item.email)) {
            matches.push(item);
          }
        });
      } else {
        this.temp.forEach(user => {
          if (!listID.includes(user.email)) {
            if (user.name.match(regex) || user.email.match(regex)) {
              matches.push(user);
            }
          }
        });
      }
      this.matches = matches;
    },
    onSave() {
      const params = this.participants.map(user => user.email);
      firebase
        .database()
        .ref(`chat-sections/${this.sectionID}`)
        .update({
          users: [...this.selected, ...params]
        })
        .then(() => {
          this.selected = [];
          this.$bvModal.hide("modal-add");
          this.getParticipants();
        });
    },
    selfLeave() {
      const index = this.participants.findIndex(
        item => this.logged_id === item.email
      );
      this.removePaticipant(index, "Leave this conversation?");
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
.leave {
  outline: none;
  border: none;
  background: #41b883;
  border-radius: 0.5rem;
  font-weight: bold;
  transition: 0.3s;
  &:active {
    transform: scale(0.9);
  }
}
</style>
