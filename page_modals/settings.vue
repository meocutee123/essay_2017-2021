<template>
  <div class="settings">
    <div class="power d-flex justify-content-center align-items-center" @click="signOut()">
      <b-icon icon="power" scale="10rem" color="#d8dbe0"></b-icon>
    </div>
    <p>Sign out</p>
  </div>
</template>

<script>
export default {
  methods:{
    signOut(){
      localStorage.removeItem('token')
      localStorage.removeItem('loged-id')
      this.$router.push('/login')
    }
  }
};
</script>

<style lang="scss" scoped>
.settings {
  height: calc(500px - 0.8 * 17px * 2);
  width: 100%;
  position: relative;
  .power {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
      .b-icon {
        transition: 0.3s;
        transform: scale(1.01);
        color: #ffadad;
      }
    }
  }
}

p {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translate(-50%, 50%);
  font-size: 1.7rem;
  font-weight: bold;
}
</style>
