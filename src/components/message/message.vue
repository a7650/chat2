<template>
  <div class="page-message">
      <friends :friendsShow="friendsShow"></friends>
      <chat :friendsShow="friendsShow"></chat> 
  </div>
</template>

<script>
import friends from './friends'
import chat from './chat'
export default {
    data(){
        return{
            friendsShow:true
        }
    },
    components:{
        friends,
        chat
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/variable.less";
@import "../../assets/mixin.less";
.page-message{
    position: absolute;
    top: 80px;
    left: 60px;
    bottom: 0;
    right: 400px;
    overflow: hidden;
    border-right:1px solid @line-color;
}


</style>
