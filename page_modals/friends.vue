<template>
  <div>
    <h3 class="font-weight-bold">Friends</h3>
    <div class="d-flex search justify-content-start align-items-center">
      <label class="m-0 mr-2" for="search">Find: </label>
      <input id="search" type="text" />
    </div>
    <div class="friends">
      <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
      <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
       <div class="friend d-flex p-2">
        <b-avatar size="4rem" class="mr-3" src="/bae-joohyun.png"></b-avatar>
        <div>
          <h4 class="font-weight-bolder">Bae Joohyun</h4>
          <p class="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
            reprehenderit.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
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
    transition: .5s;
    &:hover {
      cursor: pointer;
      background-color: #fff7f6;
    }
    div > p {
      font-size: 0.7em;
      color: #d8dbe0;
    }
  }
}
</style>
