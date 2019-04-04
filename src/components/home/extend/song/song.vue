<template>
  <div class="song">
    <process-bar :currentTime="currentTime" :duration="duration" @turnProcess="turnProcess"></process-bar>
    <div class="controls">
      <div class="title">今日推荐:《{{songData.name}}》-{{songData.singer}}</div>
      <button class="toggle" @click="toggle" :class="{'playing':playing}">{{playing?'暂停':'播放'}}</button>
    </div>
    <audio ref="audio" :src="songData.src" loop @timeupdate="timeupdate($event)" @canplay="audioCanPlay($event)"></audio>
  </div>
</template>

<script>
import processBar from "./process-bar";
export default {
  data() {
    return {
      duration: null,
      currentTime: 0,
      playing: false,
      songData:{}
    };
  },
  components: {
    processBar
  },
  sockets: {
    c_unified_getSong(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  },
  methods: {
    getSong() {
      this.$socket.emit("unified", "getSong");
    },
    c_getSong(data) {
        this.songData = data
    },
    toggle() {
      if (this.playing) {
        this.audio.pause();
        this.playing = false;
      } else {
        this.audio.play();
        this.playing = true;
      }
    },
    turnProcess(time) {
      this.audio.currentTime = time;
      if(!this.playing){
        this.toggle()
      }
    },
    timeupdate(e) {
      this.currentTime = e.currentTarget.currentTime;
    },
    audioCanPlay(e) {
      this.duration = e.currentTarget.duration;
    }
  },
  mounted() {
    this.getSong();
    this.audio = this.$refs.audio;
  }
};
</script>

<style lang="less" scoped>

.song {
  box-sizing: border-box;
  padding: 20px;
  height: 100px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  background-color: #fff;
}
.controls {
  margin-top: 3px;
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  .title{
    margin-left: 3px;
    text-overflow:ellipsis;
    overflow: hidden;
    white-space: nowrap;
    flex: 1;
  }
  .toggle{
    outline: none;
    width: 60px;
    margin-right: 5px;
    margin-left: 20px;
    height: 100%;
    border-radius: 12px;
    border: none;
    background-color: #e7e7e7;
    position: relative;
    transition: .2s;
  }
  .playing{
    transform: translateX(-5px);
    background-color: #2298f0;
    color: #fff;
  }
}
</style>
