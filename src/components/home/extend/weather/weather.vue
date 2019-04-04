<template>
  <div class="weather">
    <div class="mes" v-if="weather">
      <span class="text">当前天气：{{weather.text}} {{weather.temperature}}℃</span>
      <img class="icon" :src="weatherIcon" ondragstart="return false">
    </div>
    <div class="loading" v-else>正在加载天气信息...</div>
    <!-- <button @click="getWeather">click</button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      city: "",
      weather: null,
      weatherIcon: ""
    };
  },
  methods: {
    getWeather() {
      this.$socket.emit("unified", "getWeather", { location: "xinxiang" });
    },
    c_getWeather(data) {
      this.weather = data.results[0].now;
      this.weatherIcon = require(`./weatherIcon/${this.weather.code}.png`);
    }
  },
  sockets: {
    c_unified_weather(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  },
  created() {
    this.getWeather();
  }
};
</script>

<style  lang="less" scoped>
.weather {
  height: 70px;
  width: 100%;
  //   background-color: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  div{
    width: 100%;
    height: 100%;
    line-height: 70px;
    text-align: center;
  }
  .mes {
    display: flex;
    justify-content: center;
  }
  .text {
    display: inline-block;
    height: 70px;
    line-height: 70px;
  }
  .icon {
    width: 60px;
    height: 60px;
    margin-left: 20px;
  }
}
</style>
