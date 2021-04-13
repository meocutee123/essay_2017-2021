<template>
  <div class="card p-2">
    <div class="d-flex justify-content-between align-items-center">
      <img src="/Chat-Illustration.jpg" alt="chat" />
      <div class="login-form">
        <h1>Sign in</h1>
        <form action="">
          <div class="p-2">
            <label for="userName">Username: </label>
            <input type="text" id="userName" placeholder="Username" />
          </div>
          <div class="p-2">
            <label for="password">Password: </label>
            <input type="text" id="password" placeholder="Password" />
          </div>
          <button>Log in</button>
        </form>
      </div>
    </div>
    <div class="w-100 d-flex justify-content-around">
      <span>Create an account</span>
      <span
        >Or login with
        <b-icon class="mx-3" icon="facebook" scale="2rem"></b-icon
        ><b-icon class="mx-3" icon="twitter" scale="2rem"></b-icon
        ><b-icon class="mx-3" icon="instagram" scale="2rem"></b-icon
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  layout: "empty"
};
</script>

<style lang="scss" scoped>
.card {
  margin: 4rem;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.4rem;
  outline: 0;
  box-shadow: 2px 3px 3px 3px #e4e6eb;
}
img {
  max-height: 500px;
}
.login-form {
  border-bottom: 2px solid #ffadad;
  border-left: 2px solid #ffadad;
  border-radius: 1rem;
  padding: 0.5em;
  form {
    div {
      align-items: center;
    }
    width: 400px;
    div > label {
      font-weight: bold;
    }
    div > input {
      padding: 0.3em;
      margin-left: 1rem;
      margin-bottom: 2rem;
      border: none;
      outline: none;
      border-bottom: 1px solid #e4e6eb;
      &:focus {
      }
    }
    button {
      width: 30%;
      border: none;
      outline: none;
      border-radius: 0.5rem;
      padding: 0.3rem 0.6rem;
      font-weight: bold;
      background-color: #ffadad;
      transition: 0.3s;
      &:active {
        transform: scale(0.9);
      }
    }
  }
  h1 {
    font-weight: bold;
    line-height: 100px;
  }
}
.w-100 {
  span:nth-child(1) {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  span:nth-child(2) {
    .b-icon:hover {
      cursor: pointer;
    }
  }
}
</style>
