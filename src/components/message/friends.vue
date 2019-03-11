<template>
  <div class="page-friends" :class="{hide:!friendsShow}">
    <div class="search">
      <div class="s">
        <input type="text" v-model="searchText">
        <i class="icon-search" :class="{left:iStyle}"></i>
      </div>
    </div>
    <ul class="lists">
      <li class="add-new" v-show="searchText">
        <div v-show="tip===1" class="tip tip1" @click="addFriend1">
          从网络上添加"
          <span class="name">{{searchText}}</span>"
        </div>
        <div v-show="tip===2" class="tip tip2">
          <div>
            你将添加"
            <span class="name">{{c_search}}</span>"
          </div>
          <input type="text" placeholder="添加验证信息" v-model="add_mes">
          <br>
          <button @click="addFriend2">发送</button>
          <div class="filter" v-show="tip2Flag">
            <i class="icon-true"></i>
            <br>已向对方发送好友请求
          </div>
        </div>
        <div v-show="tip===3" class="tip tip3">{{tip3_mes}}</div>
      </li>
      <li class="list" v-for="item in filterFRIENDS" :key="item" @click="select_friend(item)" :class="{active:CURRENT_LINK===item}">
        <div class="avatar">{{item[0]}}</div>
        <div class="name">{{item}}</div>
        <div class="num" v-show="UNREAD_NUM[item]>0">{{UNREAD_NUM[item]}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      searchText: "",
      tip: 1,
      tip3_mes: "",
      c_search: "",
      add_mes: "",
      tip2Flag:false
    };
  },
  props: ["friendsShow"],
  computed: {
    iStyle() {
      if (this.searchText) {
        return true;
      }
      return false;
    },
    filterFRIENDS() {
      let n = this.searchText.toLowerCase();
      this.tip = 1;
      if (!n) {
        return this.FRIENDS;
      }
      let result = this.FRIENDS.filter(name => {
        return name.toLowerCase().indexOf(n) > -1;
      });
      return result;
    },
    ...mapGetters(["FRIENDS", "CURRENT_LINK", "UNREAD_NUM", "USER"])
  },
  methods: {
    addFriend1() {
      this.tip3_mes = `正在查找"${this.searchText}"...`;
      this.tip = 3;
      if (this.searchText===this.USER.name) {
        this.tip3_mes = "不能添加自己";
        return;
      }
      this.c_search = this.searchText;
      let n = this.FRIENDS.findIndex(i => i === this.c_search);
      if (n > -1) {
        this.tip3_mes = "对方已经是你的好友了";
        return;
      }
      this.$socket.emit("unified", "addFriend1", {
        from: this.USER.name,
        to: this.searchText
      });
    },
    c_addFriend1(data) {
      if (data.code) {
        this.tip2Flag = false;
        this.tip = 2;
      } else {
        this.tip3_mes = "不存在此人";
        this.tip = 3;
      }
    },
    addFriend2() {
      this.$socket.emit("unified", "addFriend2", {
        from: this.USER.name,
        to: this.c_search,
        mes: this.add_mes
      });
      this.tip2Flag = true;
      this.add_mes = "";
    },
    refresh_fs(name) {
      this.REFRESH_FS(name);
    },
    select_friend(name) {
      this.SET_CURRENTLINK(name);
      if (this.UNREAD_NUM[name]) {
        let newNum = {};
        newNum[name] = 0;
        this.SET_UNREADNUM(Object.assign({}, this.UNREAD_NUM, newNum));
        let data = { from: this.USER.name, to: name };
        this.$socket.emit("unified", "hasRead", data);
      }
    },
    ...mapMutations(["SET_CURRENTLINK", "SET_UNREADNUM", "REFRESH_FS"])
  },
  sockets: {
    c_unified_fs(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/mixin.less";
@import "../../assets/variable.less";

.page-friends {
  width: 300px;
  height: 100%;
  border-right: 1px solid @line-color;
  transition: 0.3s;
}
.search {
  width: 100%;
  height: 70px;
  border-bottom: 1px solid @line-color;
  box-sizing: border-box;
  padding: 0 30px;
  i {
    width: 30px;
    height: 30px;
    display: block;
    line-height: 30px;
    text-align: center;
    margin-top: -30px;
    transition: 0.3s;
    transform: translateX(105px);
  }
  input {
    width: 100%;
    height: 30px;
    background-color: @line-color;
    border-radius: 10px;
    box-sizing: border-box;
    padding-left: 35px;
  }
  .s {
    padding-top: 20px;
    .left {
      transform: translateX(0);
    }
  }
  .s:hover > i {
    transform: translateX(0);
  }
}
.add-new {
  font-size: 15px;
  color: #000;
  background-color: #fff;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid @line-color;
  background-color: rgb(243, 243, 243);
  margin-bottom: 5px;
  .tip {
    height: 30px;
    width: 100%;
  }
  .name {
    color: @theme1;
  }
  .tip3 {
    color: #ff0000;
  }
  .tip2 {
    box-sizing: border-box;
    padding: 0 30px;
    height: 100px;
    position: relative;
    .filter {
      box-sizing: border-box;
      padding-top: 20px;
      i {
        font-size: 40px;
        color: @theme1;
        font-weight: bold;
      }
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgb(255, 255, 255);
    }
    input {
      width: 100%;
      height: 25px;
      border-bottom: 3px solid @theme1;
    }
    button {
      width: 60px;
      height: 25px;
      background-color: @theme1;
      border: none;
      border-radius: 5px;
      color: #fff;
    }
    button:hover {
      background-color: #006eff;
    }
  }
}
.lists {
  .list {
    width: 100%;
    height: 70px;
    border-bottom: 1px solid @line-color;
    display: flex;
    align-items: center;
    background-color: rgb(243, 243, 243);
    .avatar {
      width: 50px;
      height: 50px;
      margin: 0 20px;
      border-radius: 25px;
      color: #000;
      font-size: 35px;
      font-weight: bold;
      line-height: 45px;
      text-align: center;
      // background-color: rgba(0, 0, 0, .05);
      background-color: #fff;
    }
    .name {
      font-size: 20px;
      color: #000;
      flex: 1;
      .no-wrap();
    }
    .num {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      background-color: @theme1;
      color: #fff;
      line-height: 20px;
      text-align: center;
      margin-right: 15px;
      font-size: 12px;
    }
  }
  .list:hover,
  .add-new:hover {
    background-color: rgb(230, 230, 230);
    cursor: pointer;
  }
  .list.active{
    background-color: @theme1;
  }
  .list.active .name{
    color: #fff;
  }
  .list.active:hover{
    background-color: @theme1;
  }
}
.hide {
  transform: translateX(-300px);
}
</style>
