<template>
  <div class="preload" >
    <img class="airplane" src="airplane.png" alt="" />
    <img class="cloud1" src="cloud.png" alt="" />
    <img class="cloud2" src="cloud.png" alt="" />
    <img class="cloud3" src="cloud.png" alt="" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.preload {
  top: 0;
  width: 100%;
  height: 90vh;
  background: #77b3d4;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: -3;
  .airplane {
    width: 220px;
    animation: airplane 1s ease-in-out infinite alternate;
    z-index: -1;
  }
  h3 {
    position: absolute;
    top: 75%;
    transform: translate(-75%);
    color: white;
    font-size: 30px;
  }
  .cloud1,
  .cloud2,
  .cloud3 {
    height: 100px;
    position: absolute;
    right: 0%;
    z-index: -2;
  }
  .cloud1 {
    top: 25%;
    transform: translate(100%, -25%);
    animation: clouds 3s ease infinite;
  }
  .cloud2 {
    top: 50%;
    transform: translate(100%, -50%);
    animation: clouds 3s ease infinite 2s;
  }
  .cloud3 {
    transform: translate(100%, -75%);
    animation: clouds 3s ease infinite 1s;
    top: 75%;
  }
  @keyframes airplane {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(100px);
    }
  }
  @keyframes clouds {
    from {
      right: 0;
    }
    to {
      right: 130%;
    }
  }
}
</style>
