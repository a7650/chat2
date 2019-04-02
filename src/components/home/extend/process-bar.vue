<template>
  <div class="time-control" @mousemove="processTouchMove" @mouseleave="processTouchEnd">
    <div class="now-time">{{timeFormate(currentTime)}}</div>
    <div class="process" ref="process">
      <div class="played" ref="played"></div>
      <div class="now" ref="now" @mousedown="processTouchStart" @mouseup="processTouchEnd">
        <div class="tips" v-if="processing">{{timeFormate(this.processTime)}}</div>
      </div>
    </div>
    <div class="total-time">{{timeFormate(duration)}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      processTime: 0,
      processing: false
    };
  },
  props: ["currentTime", "duration"],
  methods: {
    processTouchStart(e) {
      this.touch.init = true;
      this.touch.startX = e.pageX;
      this.touch.playedX = this.$refs.played.clientWidth;
      this.touch.processWidth = this.$refs.process.clientWidth;
    },
    processTouchMove(e) {
      if (!this.touch.init) {
        return;
      }
      let d_x = e.pageX - this.touch.startX;
      this.touch.playedX2 = Math.max(
        Math.min(d_x + this.touch.playedX, this.touch.processWidth),
        0
      );
      this.processTime = Math.floor(
        (this.duration * this.touch.playedX2) / this.touch.processWidth
      );
      this.set_pos(this.touch.playedX2, "px");
      this.processing = true;
    },
    processTouchEnd() {
      if (!this.touch.init) {
        return;
      }
      this.touch.init = false;
      this.processing = false;
      this.$emit("turnProcess", this.processTime);
    },
    set_pos(x, unit) {
      this.$refs.played.style.width = `${x}${unit}`;
      this.$refs.now.style.left = `${x}${unit}`;
    },
    r(x) {
      if (x < 10) {
        return "0" + x;
      }
      return x;
    },
    timeFormate(total_s) {
      let m = Math.floor(total_s / 60);
      let s = Math.floor(total_s % 60);
      return `${this.r(m)}:${this.r(s)}`;
    }
  },
  computed: {
    process() {
      return Math.floor((100 * this.currentTime) / this.duration);
    }
  },
  watch: {
    process(n, o) {
      if (!this.touch.init) {
        this.set_pos(n, "%");
      }
    }
  },
  created() {
    this.touch = {};
  }
};
</script>

<style lang="less" scoped>
.time-control {
  height: 30px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  user-select: none;
  .now-time,
  .total-time {
    flex-basis: 50px;
    line-height: 30px;
    text-align: center;
  }
  .process {
    flex: 1;
    height: 10px;
    background: rgba(0, 0, 0, .1);
    position: relative;
    margin: 0 10px;
    border-radius: 5px;
    .played {
      height: 100%;
      background: #2298f0;
      border-radius: 5px;
    }
    .now {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background: #fff;
      position: absolute;
      top: -10px;
      margin-left: -5px;
      position: relative;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      .tips {
        width: 40px;
        border-radius: 5px;
        background: #fff;
        color: #000;
        padding: 4px;
        position: absolute;
        left: -19px;
        top: -25px;
      }
    }
  }
}
</style>
