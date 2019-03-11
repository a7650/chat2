<template>
  <div class="page-chat" :class="{hide:!friendsShow}">
    <header>
      <div class="left"></div>
      <h4>{{CURRENT_LINK}}</h4>
      <div class="right"></div>
    </header>
    <div class="main" ref="main" id="main">
      <ul class="main-mes">
        <li v-for="(item,index) in message[CURRENT_LINK]" :key="index">
          <div class="you" v-if="!item.flag">
            <div class="avatar">{{avatar}}</div>
            <span class="mes">{{item.mes}}</span>
          </div>
          <div class="my" v-if="item.flag">
            <div class="avatar">我</div>
            <span class="mes">{{item.mes}}</span>
          </div>
        </li>
      </ul>
    </div>
    <footer>
      <input type="text" v-model="sendText" ref="input">
      <div class="send-button">
        <button @click="sendMessage">发送</button>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["friendsShow"],
  data() {
    return {
      avatar: "",
      sendText: "",
      message: {}
    };
  },
  computed: {
    ...mapGetters(["CURRENT_LINK", "USER", "UNREAD_NUM"])
  },
  watch: {
    CURRENT_LINK(_new, _old) {
      this.avatar = _new[0];
    }
  },
  sockets: {
    c_unified_chat(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  },
  methods: {
    set_unreadnum(name, num) {
      let newNum = {};
      newNum[name] = num;
      this.SET_UNREADNUM(Object.assign({}, this.UNREAD_NUM, newNum));
    },
    getUnread() {
      this.$socket.emit("unified", "getUnread", this.USER.name);
    },
    c_getUnread(data) {
      for (let key in data) {
        if (!this.message[key]) {
          this.$set(this.message, key, data[key]);
          this.set_unreadnum(key, data[key].length);
        } else {
          this.message[key].concat(data[key]);
        }
      }
    },
    sendMessage() {
      if(!this.CURRENT_LINK){
        window.alert("请选择联系人");
        return;
      }
      if (!this.sendText) {
        window.alert("请输入内容再发送");
        return;
      }
      let m = {
        sendBy: this.USER.name,
        sendTo: this.CURRENT_LINK,
        message: { time: new Date(), mes: this.sendText }
      };
      this.$socket.emit("unified", "sendMessage", m);
      this.sendText = "";
      let n = Object.assign({}, m.message, { flag: true });
      if (!this.message[this.CURRENT_LINK]) {
        this.$set(this.message, this.CURRENT_LINK, [n]);
      } else {
        this.message[this.CURRENT_LINK].push(n);
      }
      this.$nextTick(()=>{
        let main = document.getElementById('main');
        main.scrollTop = main.scrollHeight;
      })
    },
    receiveMessage(data) {
      if (!this.message[data.sendBy]) {
        this.$set(this.message, data.sendBy, [data.mes]);
      } else {
        this.message[data.sendBy].push(data.mes);
      }
      if (data.sendBy !== this.CURRENT_LINK) {
        let n = this.UNREAD_NUM[data.sendBy];
        let num = n ? n + 1 : 1;
        this.set_unreadnum(data.sendBy, num);
      }
      this.$nextTick(()=>{
        let main = document.getElementById('main');
        main.scrollTop = main.scrollHeight;
      })
    },
    ...mapMutations(["SET_CURRENTLINK", "SET_UNREADNUM"])
  },
  created() {
    this.getUnread();
  },
  mounted(){
    this.$refs.input.addEventListener('keydown',event=>{
      let e = event||window.event
      if(e.keyCode===13){
        this.sendMessage()
      }
    })
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/mixin.less";
@import "../../assets/variable.less";
.page-chat {
  position: absolute;
  left: 300px;
  right: 0;
  top: 0;
  bottom: 0;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
}
header {
  height: 70px;
  width: 100%;
  border-bottom: 1px solid @line-color;
  .left,
  .right {
    height: 100%;
    width: 25%;
    display: block;
    float: left;
  }
  h4 {
    float: left;
    width: 50%;
    height: 100%;
    line-height: 70px;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    .no-wrap();
  }
}
.hide {
  left: 0;
}
.main {
  flex: 1;
  height: 1px;
  width: 100%;
  overflow-y: scroll;
}

footer {
  height: 70px;
  width: 100%;
  border-top: 1px solid @line-color;
  box-sizing: border-box;
  padding: 20px 50px 0 50px;
  display: flex;
  input {
    height: 30px;
    width: 100%;
    background-color: @input-color;
    float: left;
    border-radius: 15px;
    flex: 1;
  }
  .send-button {
    width: 70px;
    height: 30px;
    text-align: center; 
    button {
      width: 50px;
      height: 100%;
      background-color: @theme1;
      border-radius: 15px;
      border: none;
      color: #fff;
    }
  }
}
.main-mes {
  li {
    padding: 20px 20px;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    font-size: 25px;
    line-height: 50px;
    text-align: center;
    display: inline-block;
  }
  .mes {
    padding: 10px;
    line-height: 25px;
    margin-top: 10px;
    border-radius: 10px;
    max-width: 60%;
    word-break: break-all;
  }
  .you {
    .avatar {
      background-color: @theme2;
      color: #fff;
      float: left;
      margin-right: 20px;
    }
    .mes {
      background-color: rgb(226, 226, 226);
      float: left;
    }
  }
  .my {
    .avatar {
      color: #fff;
      background-color: @theme1;
      float: right;
      margin-left: 20px;
    }
    .mes {
      float: right;
      background-color: @theme1;
    }
  }
}
</style>
