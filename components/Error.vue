<template>
  <div class="error">
      <h4>Sorry, this app is not supported on Mobile Devices</h4>
      <p>To use this app, please you a computer or Tablet</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.error{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #41b883;
    flex-direction: column;
    color: #fff;
    p{
        margin: 32px;
    }
}
</style>