<template>
  <Tran>
    <div class="page-home">
      <div ref="detail" class="detail" v-show="detail">{{detail_mes}}</div>
      <div class="head">
        <h3>Message</h3>
        <div class="sys">
          <div class="item" v-for="(item,index) in sys" :key="item.sendBy">
            <div class="content">
              <span class="name">"{{item.sendBy}}"希望添加您为好友</span>
              <span
                class="mes"
                @click="getDetail(item.mes)"
                @mousemove="moveDetail($event,item.mes)"
                @mouseenter="detail=true;detail_mes=item.mes"
                @mouseleave="detail=false"
              >附加信息:{{item.mes||"无"}}</span>
              <div class="button">
                <button @click="refuse(item.sendBy,index)">拒绝</button>
                <button @click="agree(item.sendBy,index)">同意</button>
              </div>
            </div>
          </div>
        </div>
        <div class="mine">
          <div class="avatar">{{USER.name[1]}}</div>
          <div class="info">
            <div class="name">{{USER.name}}</div>
            <div class="exit">
              <button @click="exit_alert=!exit_alert">Exit</button>
              <div class="alert" v-show="exit_alert">
                <div class="mes">确定退出吗?</div>
                <div class="button">
                  <span @click="exit_alert=!exit_alert">取消</span>
                  <span @click="exit">确定</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="side-bar">
        <div class="item">通讯</div>
        <div class="item">备忘</div>
      </div>
      <router-view></router-view>
    </div>
  </Tran>
</template>

<script>
import Tran from "base/animation/home";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      exit_alert: false,
      sys: [],
      detail: false,
      detail_mes: ""
    };
  },
  computed: {
    ...mapGetters(["USER", "FRIENDS"])
  },
  methods: {
    moveDetail(e,mes){
      this.detail_mes = mes
      let d = this.$refs.detail
      d.style.top = `${e.pageY + 30}px`
      d.style.left = `${e.pageX - 50}px`
    },
    getDetail(mes) {
      window.alert(mes || "无");
    },
    refuse(name, index) {
      let n = [...this.sys];
      n.splice(index, 1);
      this.sys = n;
      this.$socket.emit("unified", "removeSys", {
        from: this.USER.name,
        to: name
      });
    },
    agree(name, index) {
      let m = this.FRIENDS.findIndex(item => item === name);
      if (m > -1) {
        return;
      }
      let n = [...this.sys];
      n.splice(index, 1);
      this.sys = n;
      this.$socket.emit("unified", "agreeFriend", {
        from: this.USER.name,
        to: name
      });
      this.REFRESH_FS(name);
    },
    getUnreadSys() {
      this.$socket.emit("unified", "getUnreadSys", this.USER.name);
    },
    c_getUnreadSys(data) {
      let n = [...data, ...this.sys].reverse();
      this.sys = n;
    },
    receiveSys(data) {
      this.c_getUnreadSys([data]);
    },
    exit() {
      this.$router.replace({
        name: "login"
      });
      this.$socket.emit("unified", "exit", this.USER.name);
      this.EXIT();
    },
    ...mapMutations(["EXIT", "REFRESH_FS"])
  },
  components: {
    Tran
  },
  sockets: {
    c_unified_home(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  },
  created() {
    this.getUnreadSys();
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/variable.less";
@import "../../assets/mixin.less";
.page-home {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.detail{
  background-color: #fff;
  padding: 15px;
  color: #000;
  position: fixed;
  max-width: 300px;
  word-break: break-all;
  border: 1px solid @line-color;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
}
.side-bar {
  width: 60px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: @theme2;
  .item {
    width: 50px;
    height: 50px;
    margin-left: 5px;
    margin-top: 20px;
    border-radius: 25px;
    background-color: @theme1;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    transition: 0.2s;
  }
  .item:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
}
.head {
  box-sizing: border-box;
  padding-left: 60px;
  height: 80px;
  border-bottom: 1px solid @line-color;
  display: flex;
  h3 {
    line-height: 80px;
    font-size: 25px;
    font-weight: bold;
    width: 290px;
    padding-left: 10px;
    float: left;
  }
  .mine {
    width: 150px;
    height: 100%;
    display: flex;
    margin-left: 250px;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      background-color: @theme1;
      margin-right: 10px;
      margin-top: 15px;
      text-align: center;
      line-height: 45px;
      font-size: 30px;
      font-weight: bold;
      color: #fff;
    }
    .info {
      flex: 1;
      height: 80px;
      display: flex;
      flex-direction: column;
      .name {
        flex: 1;
        box-sizing: border-box;
        line-height: 40px;
        padding-left: 3px;
        .no-wrap();
      }
      .exit {
        flex: 1;
        position: relative;
        button {
          width: 60px;
          height: 20px;
          border-radius: 10px;
          background-color: #ff0000;
          color: #fff;
          border: none;
        }
        .alert {
          z-index: 99;
          width: 150px;
          height: 80px;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          position: absolute;
          top: 100%;
          right: 0;
          animation: alert 0.2s;
          transform-origin: center top;
          .mes {
            height: 50px;
            width: 100%;
            line-height: 50px;
            text-align: center;
            color: #000;
          }
          .button {
            height: 30px;
            display: flex;
            justify-content: space-around;
            span {
              width: 50px;
              height: 20px;
              // margin-top: 5px;
              background-color: @theme1;
              text-align: center;
              line-height: 20px;
              color: #fff;
              border-radius: 5px;
              font-size: 12px;
            }
            span:hover {
              cursor: pointer;
              background-color: #2266f0;
            }
          }
        }
      }
    }
  }
}
.sys {
  z-index: 99;
  flex: 1;
  height: 100%;
  width: 1px;
  position: relative;
  .item {
    width: 100%;
    min-width: 350px;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 2px;
    animation: item 0.5s;
  }
  .content {
    max-width: 100%;
    padding: 8px;
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    .no-wrap();
  }
  .name {
    margin-right: 20px;
    .no-wrap;
  }
  .mes {
    .no-wrap;
  }
  .mes:hover {
    cursor: pointer;
  }
  .button {
    margin-top: 10px;
    width: 100%;
    text-align: center;
    button {
      width: 60px;
      height: 20px;
      background-color: @theme1;
      border-radius: 5px;
      color: #fff;
      border: none;
      margin-right: 20px;
    }
    button:hover {
      background-color: #2266f0;
    }
  }
}
@keyframes alert {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes item {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
