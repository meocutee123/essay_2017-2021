<template>
  <div>
    <h3 style="font-size: 1.70rem" class="font-weight-bold">
      People you might know
    </h3>
    <div class="d-flex search justify-content-start align-items-center">
      <label class="m-0 mr-2" for="search">Find: </label>
      <input id="search" type="text" />
    </div>
    <h5 class="font-weight-bold">Friends</h5>
    <div v-if="isLoading" class="friends d-flex my-3">
      <b-skeleton width="90px" height="70px" type="avatar"></b-skeleton>
      <div style="width: 80%" class="ml-3 mt-2">
        <b-skeleton animation="wave" width="90%"></b-skeleton>
        <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
      </div>
      <b-skeleton-icon
        icon="person"
        :icon-props="{ fontScale: 1.7 }"
      ></b-skeleton-icon>
    </div>
    <div v-if="isLoading" class="friends d-flex my-3">
      <b-skeleton width="90px" height="70px" type="avatar"></b-skeleton>
      <div style="width: 80%" class="ml-3 mt-2">
        <b-skeleton animation="wave" width="90%"></b-skeleton>
        <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
      </div>
      <b-skeleton-icon
        icon="person"
        :icon-props="{ fontScale: 1.7 }"
      ></b-skeleton-icon>
    </div>
    <div v-if="isLoading" class="friends d-flex my-3">
      <b-skeleton width="90px" height="70px" type="avatar"></b-skeleton>
      <div style="width: 80%" class="ml-3 mt-2">
        <b-skeleton animation="wave" width="90%"></b-skeleton>
        <b-skeleton animation="wave" class="mt-2" width="55%"></b-skeleton>
      </div>
      <b-skeleton-icon
        icon="person"
        :icon-props="{ fontScale: 1.7 }"
      ></b-skeleton-icon>
    </div>
    <div class="friends">
      <div
        class="friend d-flex p-2 align-items-center"
        v-for="(person, index) in friends"
        :key="index"
      >
        <b-avatar
          size="3rem"
          class="mr-3"
          :src="`${person.picture}`"
        ></b-avatar>
        <div>
          <h5 class="font-weight-bolder mb-0">
            {{ person.name }}
          </h5>
          <small v-if="person.status === 0" class="text-success">
            "(Pending accept)</small
          >
        </div>
        <b-icon
          class="mt-1"
          :id="`icon-${index}`"
          style="color: red"
          icon="person-x-fill"
          scale="1.5rem"
          @click="removeFriend(person)"
        ></b-icon>
      </div>
    </div>
    <h5 class="font-weight-bold">Suggested</h5>
    <div class="friends">
      <div
        class="friend d-flex p-2 align-items-center"
        v-for="(person, index) in people"
        :key="index"
      >
        <b-avatar
          size="3rem"
          class="mr-3"
          :src="`${person.picture}`"
        ></b-avatar>
        <div>
          <h5 class="font-weight-bolder">
            {{ person.name }}
          </h5>
        </div>
        <b-icon
          class="mt-1 ml-2"
          style="color: #41b883"
          :icon="'person-plus-fill'"
          scale="1.5rem"
          @click="sendRequest(person)"
        ></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  props: ["user"],
  data() {
    return {
      friends: [],
      people: [],
      isRequested: {},
      users: null,
      logged_id: null,
      isLoading: false
    };
  },
  async mounted() {
    this.logged_id = this.$auth.user.email;
    this.getFriends();
  },
  methods: {
    getPeople(ids) {
      firebase
        .database()
        .ref("users")
        .on("value", snapshot => {
          if (snapshot.exists()) {
            const people = [];
            const response = snapshot.val();
            for (let key in response) {
              if (
                response[key].email != this.logged_id &&
                !ids.includes(response[key].email)
              ) {
                people.push({ ...response[key], request_id: key });
              }
            }
            this.isLoading = false;
            this.people = people;
          } else {
            this.isLoading = false;
            this.people = [];
          }
        });
    },
    getFriends() {
      this.isLoading = true;
      firebase
        .database()
        .ref("/users/" + this.user.request_id)
        .on("value", snapshot => {
          const friends = [];

          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data.friends) {
              friends.push({ ...data.friends[key], data_request: key });
            }
            const listID = friends.map(item => item.email);
            this.isLoading = false;
            this.friends = friends;
            this.getPeople(listID);
          } else {
            this.isLoading = false;
            this.friends = [];
          }
        });
    },
    async sendRequest(person) {
      const db = firebase.database();
      const key = firebase
        .database()
        .ref()
        .child("users/" + this.user.request_id + "/requests/")
        .push().key;

      db.ref("users/" + this.user.request_id + "/friends/" + key).update(
        {
          ...person,
          status: 0,
          from: this.logged_id,
          created_date: new Date()
        },
        error => {
          console.log(error);
        }
      );
      db.ref("users/" + person.request_id + "/friends/" + key).update(
        {
          ...this.user,
          status: 0,
          from: this.logged_id,
          isNew: true,
          created_date: new Date()
        },
        error => {
          console.log(error);
        }
      );
    },
    async removeFriend(person) {
      const qoutes = [
        "If true friendship always stays, who are the friends that leave?",
        "Good friends are hard to find, harder to leave, & imposible to forget.",
        "Some people are going to leave but that's not the end of our story.",
        "Friends come and go like waves of the ocean but the true one sticks like an octopus on your face.",
        "I hate it when my friends change just because they meet new people.",
        "You should've ended me when you had the chance. Look up in the sky it's a bird it's a plane",
        "I don't know what your problem is, or why you hate me or stopped talking to me. But I honestly dont Care! Your loss not mine.",
        "A milions memories flashed by through my mind but I just smile and said I used to.",
      ];
      const index = Math.floor(Math.random() * 7);
      const action = await this.$swal.fire({
        title: qoutes[index],
        imageUrl: person.picture,
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonText: "Yes, remove anyway!",
        confirmButtonColor: "#41b883",
        cancelButtonText: "No, cancel!"
      });
      if (action.isConfirmed) {
        firebase
          .database()
          .ref(
            "users/" + this.user.request_id + "/friends/" + person.data_request
          )
          .remove();
        firebase
          .database()
          .ref("users/" + person.request_id + "/friends/" + person.data_request)
          .remove();
      }
    }
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
    position: relative;
    .b-icon {
      position: absolute;
      top: 0.5rem;
      right: 0.3rem;
    }
    &:hover {
      background-color: #fff7f6;
    }
    .b-icon:hover {
      cursor: pointer;
    }
    div > p {
      font-size: 0.7em;
      color: #d8dbe0;
    }
  }
}
</style>
