<template>
  <Tran>
    <div class="page-home">
      <div class="head">
        <h3>Message</h3>
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
import Tran from "base/animation/home"
import {mapGetters,mapMutations} from 'vuex'
export default {
  data(){
    return{
      exit_alert:false
    }
  },
  computed:{
    ...mapGetters([
      'USER',
      'FRIENDS'
    ])
  },
  methods:{
    exit(){
      this.$router.replace({
        name:'login'
      })
      this.EXIT()
    },
    ...mapMutations([
      'EXIT'
    ])
  },
  components: {
    Tran
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/variable.less";
@import "../../assets/mixin.less";
.page-home {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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
    transition: .2s;
  }
  .item:hover{
    transform: scale(1.1);
    cursor: pointer;
  }
}
.head {
  box-sizing: border-box;
  padding-left: 60px;
  height: 80px;
  border-bottom: 1px solid @line-color;
 
  h3 {
  line-height: 80px;
    font-size: 25px;
    font-weight: bold;
    margin-left: 10px;
    width: 20%;
    float: left;
  }
  .mine {
    width: 150px;
    height: 100%;
    float: right;
    display: flex;
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
        padding-left: 3PX;
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
        .alert{
           z-index: 99;
          width: 150px;
          height: 80px;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, .2);
          position: absolute;
          top: 100%;
          right: 0;
          animation: alert .2s;
          transform-origin: center top;
          .mes{
            height: 50px;
            width: 100%;
            line-height:50px;
            text-align: center;
            color: #000;
          }
          .button{
            height: 30px;
            display: flex;
            justify-content: space-around;
            span{
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
            span:hover{
              cursor: pointer;
              background-color: #2266f0;
            }
          }
        }
      }
    }
  }
}

@keyframes alert {
  0%{
    transform: scale(.5);
    opacity: 0;
  }
  100%{
    transform: scale(1);
    opacity: 1;
  }
}
</style>
