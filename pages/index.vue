<template>
  <page-container>
    <template v-slot:sidebar>
      <div class="side-header d-flex">
        <span>Chats</span>
        <div class="ml-auto new-chat">
          <button class="btn-light-grey">
            <b-icon icon="three-dots" aria-hidden="true"></b-icon>
          </button>
          <button class="btn-light-grey">
            <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
          </button>
        </div>
      </div>
      <div class="chats d-flex flex-column">
        <div class="user d-flex">
          <b-avatar size="3.3rem"></b-avatar>
          <span
            >Nguyễn Tuấn Nghĩa
            <p class="active">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              accusamus cum non.
            </p>
          </span>
          <div class="unread">
            <b-icon
              icon="circle-fill"
              style="color: #41b883"
              scale=".8rem"
            ></b-icon>
          </div>
        </div>
        <div class="user d-flex">
          <b-avatar size="3.3rem"></b-avatar>
          <span
            >Nguyễn Tuấn Nghĩa
            <p class="active">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              accusamus cum non.
            </p>
          </span>
          <div class="unread">
            <b-icon
              icon="circle-fill"
              style="color: #41b883"
              scale=".8rem"
            ></b-icon>
          </div>
        </div>
        <div class="user d-flex">
          <b-avatar size="3.3rem"></b-avatar>
          <span
            >Nguyễn Tuấn Nghĩa
            <p class="active">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              accusamus cum non.
            </p>
          </span>
          <div class="unread">
            <b-icon
              icon="circle-fill"
              style="color: #41b883"
              scale=".8rem"
            ></b-icon>
          </div>
        </div>
        <div class="user d-flex">
          <b-avatar size="3.3rem"></b-avatar>
          <span
            >Nguyễn Tuấn Nghĩa
            <p class="active">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              accusamus cum non.
            </p>
          </span>
          <div class="unread">
            <b-icon
              icon="circle-fill"
              style="color: #41b883"
              scale=".8rem"
            ></b-icon>
          </div>
        </div>
        <div class="user d-flex">
          <b-avatar size="3.3rem"></b-avatar>
          <span
            >Nguyễn Tuấn Nghĩa
            <p class="active">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              accusamus cum non.
            </p>
          </span>
          <div class="unread">
            <b-icon
              icon="circle-fill"
              style="color: #41b883"
              scale=".8rem"
            ></b-icon>
          </div>
        </div>
        <div class="user d-flex">
          <b-avatar size="3.3rem"></b-avatar>
          <span
            >Nguyễn Tuấn Nghĩa
            <p class="active">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              accusamus cum non.
            </p>
          </span>
          <div class="unread">
            <b-icon
              icon="circle-fill"
              style="color: #41b883"
              scale=".8rem"
            ></b-icon>
          </div>
        </div>
      </div>
    </template>
    <section>
      <div :class="['blink d-flex flex-column', { blinkActive: isActive }]">
        <div class="chat-header d-flex flex-column">
          <div class="d-flex">
            <h2>Batch 5 - DH Nha Trang</h2>
            <div
              class="ml-auto actions d-flex justify-content-between align-items-center"
            >
              <b-icon icon="telephone" scale="1.3rem"></b-icon>
              <b-icon icon="camera-video" scale="1.3rem"></b-icon>
              <b-icon icon="person-plus" scale="1.3rem"></b-icon>
            </div>
          </div>
          <div class="detail">
            <p>
              <span>13 paticipants</span> |
              <span @click="isActive = !isActive"
                ><b-icon icon="journal-album" scale="1rem"></b-icon>
                Gallery</span
              >
              |
              <span><b-icon icon="search" scale="1rem"></b-icon> Find</span>
            </p>
          </div>
        </div>
        <div class="chat-section mt-auto px-3">
          <div class="greetings text-center p-2">
            <b-avatar
              src="https://placekitten.com/300/300"
              size="6rem"
            ></b-avatar>
            <h3>Nguyễn Tuấn Nghĩa</h3>
            <span>Now you can start conversation together</span>
          </div>
          <div
            class="conversations d-flex align-items-end flex-column p-2 ml-auto"
          >
            <div class="content">
              <div>Lorem ipsum dolor sit amet.</div>
            </div>
            <div class="content">
              <div>Lorem, ipsum dolor.</div>
            </div>
            <div class="content">
              <div>
                Lorem ipsum dolor sit amet consectetur, adipisici elit.
                Perspiciatis, suscipit!
              </div>
            </div>
            <b-avatar class="to" size="1rem"></b-avatar>
          </div>
          <div class="conversations d-flex align-items-start flex-column p-2">
            <div class="content">
              <div>Lorem ipsum dolor sit amet.</div>
            </div>
            <div class="content">
              <div>Lorem, ipsum dolor.</div>
            </div>
            <div class="content">
              <div>
                Lorem ipsum dolor sit amet consectetur, adipisici elit.
                Perspiciatis, suscipit!
              </div>
            </div>
            <b-avatar class="from" size="1rem"></b-avatar>
          </div>
          <div
            class="conversations d-flex align-items-end flex-column p-2 ml-auto"
          >
            <div class="content">
              <div>Lorem ipsum dolor sit amet.</div>
            </div>
            <div class="content">
              <div>Lorem, ipsum dolor.</div>
            </div>
            <b-avatar class="to" size="1rem"></b-avatar>
          </div>
          <div class="conversations d-flex align-items-start flex-column p-2">
            <div class="content">
              <div>Lorem ipsum dolor sit amet.</div>
            </div>
            <b-avatar class="from" size="1rem"></b-avatar>
          </div>
        </div>
        <div class="play-ground d-flex">
          <div
            class=" pg-actions d-flex justify-content-between align-items-center mb-2"
          >
            <b-icon icon="image" scale="1.3rem"></b-icon>
            <b-icon icon="share-fill" scale="1.3rem"></b-icon>
            <b-icon icon="mic-fill" scale="1.3rem"></b-icon>
          </div>
          <div class="message d-flex">
            <div class="text">
              <textarea
                rows="2"
                placeholder="Type a message"
                @focus="onFocus = true"
                @blur="onfocus = false"
              ></textarea>
              <b-icon
                class="icon-smile"
                icon="emoji-smile-fill"
                scale="1.4rem"
              ></b-icon>
            </div>
            <b-icon
              class="focus-icon mt-2 ml-3"
              :icon="onFocus ? 'cursor-fill' : 'heart-fill'"
              scale="1.4rem"
            ></b-icon>
          </div>
        </div>
      </div>
      <div :class="[{ active: isActive }, 'gallery']" id="gallery">
        <div class="gallery-head d-flex align-items-center">
          <b-icon
            @click="isActive = !isActive"
            class="mb-1"
            icon="x"
            scale="2rem"
          ></b-icon>
          <h2 class="ml-3">Gallery</h2>
          <div></div>
        </div>
      </div>
    </section>
  </page-container>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
      onFocus: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.side-header {
  padding: 1rem 0.3em;
  height: 60px;
  background-color: #ffffff;
  span {
    font-weight: bolder;
    font-size: 1.5rem;
  }
}
.chats {
  box-sizing: border-box;
  overflow: scroll;
  border-top: 1px solid rgb(211, 211, 211);
  height: 100%;
  .user {
    margin: 0.5rem;
    padding: 1em 1em;
    transition: 0.5s;
    border-radius: 1rem;
    &:hover {
      cursor: pointer;
      background-color: #d3d6df;
    }
    .unread {
      position: relative;
      left: 10px;
    }
    span {
      margin-right: 1em;
      font-size: 1.1rem;
      font-weight: bold;
      p {
        font-size: 0.8rem;
        text-overflow: ellipsis;
        max-width: 150px;
        overflow: hidden;
        height: 1.2em;
        white-space: nowrap;
      }
      .active {
        color: #41b883;
        font-weight: bold;
      }
    }
  }
}
section {
  position: relative;
  height: inherit;
  width: 100%;
  min-width: 400px;
  .blink {
    height: inherit;
    width: 100%;
    transition: 0.5s ease-in;
    position: relative;
    .chat-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e4e6eb;
      padding: 1rem 1rem 0.3rem 1rem;
      z-index: 2;
      max-height: 100px;
      h2 {
        font-weight: bolder;
      }
      .actions {
        width: 100px;
        .b-icon {
          cursor: pointer;
        }
      }
      .detail {
        p {
          font-size: 0.8rem;
          color: #d8dbe0;
          font-weight: bold;
          span {
            margin: 0.4rem;
            transition: 0.4s;
            &:hover {
              cursor: pointer;
              color: #35495e;
            }
          }
        }
      }
    }
    .chat-section {
      position: absolute;
      width: 100%;
      bottom: 3.5rem;
      background-color: #f2fff9;
      height: calc(100% - 156px);
      overflow-y: scroll;
      .greetings {
        h3 {
          font-weight: bolder;
        }
        span {
          color: #a3a3a3;
        }
      }
      .conversations {
        max-width: 400px;
        position: relative;
        .b-avatar {
          position: absolute;
          bottom: 1.3rem;
        }
        .to {
          right: -0.8rem;
        }
        .from {
          left: -0.8rem;
        }
        .content {
          div {
            display: inline-block;
            // layout
            position: relative;
            max-width: 30em;
            margin-bottom: 0.7rem !important;
            // looks
            background-color: #d5ffec;
            padding: 0.5em 1em;
            font-size: 1em;
            border-radius: 1rem;
          }
        }
      }
    }
    .play-ground {
      max-height: 3.5rem;
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0.5rem;
      .pg-actions {
        color: #41b883;
        padding: 5px 15px 5px 10px;
        min-width: 150px;
      }
      .message {
        width: inherit;
        .text {
          width: 93%;
          position: relative;
          textarea {
            width: 100%;
            height: 2rem !important;
            border-radius: 2rem;
            outline: none;
            border: none;
            background-color: #cef1e2;
            resize: none;
            padding-left: 0.5rem;
            color: #35495e;
            &::-webkit-scrollbar {
              display: none;
            }
          }
          .icon-smile {
            position: absolute;
            color: #41b883;
            top: 0.5rem;
            right: 0.5rem;
            transition: 0.2s;
            &:hover {
              cursor: pointer;
              color: #35bb7f;
            }
          }
        }
        .focus-icon {
          color: #41b883;
          transition: 0.2s;
          &:hover {
            cursor: pointer;
            color: #35bb7f;
          }
        }
      }
    }
  }
  .gallery {
    border-left: 1px solid #e4e6eb;
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
    height: inherit;
    transform: translateX(100%);
    transition: 0.5s ease-in;
    .gallery-head {
      padding-left: 1rem;
      .mb-1 {
        cursor: pointer;
      }
      h2 {
        font-weight: bolder;
      }
    }
  }
  .active {
    transform: translateX(0);
  }
  .blinkActive {
    width: calc(100% - 300px);
  }
}
.btn-light-grey {
  color: #111111;
  font-weight: bold;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
}
</style>
