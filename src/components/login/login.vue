<template>
<Tran>
  <div class="page-login">
    <div class="right">
      <transition name="login-window">
        <div class="window login-window" v-show="window===1">
          <header>COME ON</header>
          <div class="header-line"></div>
          <div class="name1 name">
            <i class="icon-user"></i>
            <input type="text" placeholder="用户名" v-model="name1" ref="name1">
          </div>
          <div class="pas1 pas">
            <i class="icon-password"></i>
            <input type="password" placeholder="密码" v-model="pas1" ref="pas1">
          </div>
          <div class="tip" v-html="tip0"></div>
          <button class="login" @click="login">登录</button>
          <div class="more">
            <span @click="window=2">注册账号</span>
            <span>忘记密码</span>
          </div>
        </div>
      </transition>
      <transition name="register-window">
        <div class="window register-window" v-show="window===2">
          <header>注册</header>
          <div class="header-line"></div>
          <div class="name2-tip">用户名需以字母开头,且至少4位</div>
          <div class="name2 name">
            <i class="icon-user"></i>
            <input type="text" placeholder="用户名" v-model="name2" ref="name2">
          </div>
          <div class="pas2 pas">
            <i class="icon-password"></i>
            <input type="password" placeholder="密码" v-model="pas2" ref="pas2">
          </div>
          <div class="tip" v-html="tip"></div>
          <button class="register" @click="register">注册</button>
          <div class="more more2">
            <span class="back" @click="window=1">返回登录界面</span>
          </div>
        </div>
      </transition>
    </div>
    <div class="left">
      <img src="./LOGIN.jpg" ondragstart="return false" alt="bg" class="bg">
    </div>
  </div>
  </Tran>
</template>

<script>
import Tran from 'base/animation/login'
import {mapMutations} from 'vuex' 
export default {
  components:{
    Tran
  },
  data() {
    return {
      name1: null,
      pas1: null,
      name2: null,
      pas2: null,
      window: 1,
      Status: {
        type: ""
      },
      tip0: "",
      tip: ""
    };
  },
  methods: {
    checkName2() {
      var error = false;
      switch (true) {
        case !this.name2:
          this.tip = "用户名不能为空";
          error = true;
          break;
        case !/^[a-zA-Z]/.test(this.name2):
          this.tip = "用户名必须以字母开头";
          error = true;
          break;
        case this.name2.length < 4:
          this.tip = "用户名至少为4位";
          error = true;
          break;
        default:
          this.tip = "";
      }
      return error;
    },
    checkName1() {
      var err = false;
      var str = this.name1;
      switch (true) {
        case !str:
          this.tip0 = "用户名不能为空";
          err = true;
          break;
        case !/^[a-zA-Z]/.test(str) || str.length < 4:
          this.tip0 = "用户名不合法";
          err = true;
          break;
        default:
          this.tip0=""
      }
      return err
    },
    login() {
      let err = this.checkName1()
      if(err){
        return
      }else if(!this.pas1){
        this.tip0 = "请输入密码"
        return
      }
      this.tip0 = "正在登录..."
      this.$socket.emit("unified","login",{name:this.name1,pas:this.pas1})

    },
    c_login(data){
      if(data.code === 0){
        this.tip0 = data.mes
        setTimeout(() => {
          this.tip0 = "";
        }, 1500);
      }else{
        this.tip0 = "<p style=color:#2298f0>验证通过</p>"
        let user = data.data
        this.SET_USER({name:user.name,password:user.password,vip:user.vip})
        this.SET_FRIENDS(user.friends)
        this.$router.replace({name:'home'})
      }
    },
    register() {
      let error = this.checkName2();
      if (error) {
        return;
      } else if (!this.pas2) {
        this.tip = "密码不能为空";
        return;
      }
      this.tip = "数据已提交服务器,请稍等...";
      this.$socket.emit("unified", "register", {
        name: this.name2,
        pas: this.pas2
      });
    },
    c_register(data) {
      if (data.code === 1) {
        this.tip = `<p style=color:#2298f0>${data.mes}</p>`;
        setTimeout(() => {
          this.tip = "";
        }, 1500);
        this.name1 = this.name2;
        this.pas1 = this.pas2;
      } else {
        this.tip = data.mes;
      }
    },
    ...mapMutations([
      'SET_USER',
      'SET_FRIENDS'
    ])
  },
  sockets: {
    c_unified(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  },
  mounted() {
    this.$refs.name2.addEventListener("blur", this.checkName2);
    this.$refs.name1.addEventListener("blur", this.checkName1);
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/variable.less";
.left {
  position: relative;
  .bg {
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.page-login {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  animation-duration: .3s;
  transition: .5s;
}
.left {
  height: 100%;
  overflow: hidden;
}
.right {
  width: 800px;
  height: 100%;
  float: right;
  position: relative;
}
.window {
  width: 300px;
  height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -200px 0 0 -150px;
  transition: 0.4s;
  // border:1px solid black;
  header {
    font-size: 40px;
    font-weight: bold;
  }
  .header-line {
    margin: 10px 0 20px 0;
    width: 80px;
    height: 6px;
    background-color: #000;
  }
  .name2-tip {
    height: 15px;
    line-height: 15px;
    color: @font-color;
    font-size: 15px;
    margin-bottom: 10px;
  }
  .name,
  .pas {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: relative;
    i {
      font-size: 20px;
      margin-left: 5px;
      color: rgba(0, 0, 0, 1);
      // color: rgb(241, 241, 241);
    }
    input {
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(241, 241, 241, 0.9);
      border-radius: 10px;
      box-sizing: border-box;
      padding-left: 30px;
    }
  }
  .pas {
    margin-top: 20px;
  }
  .tip {
    width: 100%;
    height: 15px;
    margin-top: 10px;
    line-height: 15px;
    color: #ff0000;
    font-size: 15px;
    text-align: center;
  }
  .login,
  .register {
    width: 100%;
    height: 40px;
    border-radius: 10px;
    margin-top: 15px;
    background-color: @theme1;
    border: none;
    color: #fff;
  }
  button:hover {
    background-color: #00ddff;
  }
  .more {
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    span {
      color: @font-color;
    }
    span:hover {
      cursor: pointer;
      color: #000;
    }
  }
  .more2 {
    justify-content: center;
  }
}
.login-window-enter,
.login-window-leave-to {
  left: 0;
  opacity: 0;
  transform: scale(0.8);
}
.register-window-enter,
.register-window-leave-to {
  transform: scale(0.8);
  left: 100%;
  opacity: 0;
}
</style>
