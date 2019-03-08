<template>
  <div class="page-friends" :class="{hide:!friendsShow}">
    <div class="search">
      <div class="s">
        <input type="text" v-model="searchText">
        <i class="icon-search"></i>
      </div>
    </div>
    <ul class="lists">
      <li class="list" v-for="item in filterFRIENDS" :key="item" @click="select_friend(item)">
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
      searchText: ""
    };
  },
  props: ["friendsShow"],
  computed: {
    filterFRIENDS() {
      let n = this.searchText.toLowerCase();
      if (!n) {
        return this.FRIENDS;
      }
      let result = this.FRIENDS.filter(name => {
        return name.toLowerCase().indexOf(n) > -1;
      });
      return result;
    },
    ...mapGetters(["FRIENDS", "CURRENT_LINK", "UNREAD_NUM","USER"])
  },
  methods: {
    select_friend(name) {
      this.SET_CURRENTLINK(name);
      if (this.UNREAD_NUM[name]) {
        let newNum = {};
        newNum[name] = 0;
        this.SET_UNREADNUM(Object.assign({},this.UNREAD_NUM,newNum))
        let data = {from:this.USER.name,to:name}
        this.$socket.emit("unified","hasRead",data)
      }
    },
    ...mapMutations(["SET_CURRENTLINK", "SET_UNREADNUM"])
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
  }
  .s:hover > i {
    transform: translateX(0);
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
  .list:hover {
    background-color: rgb(230, 230, 230);
    cursor: pointer;
  }
}
.hide {
  transform: translateX(-300px);
}
</style>
