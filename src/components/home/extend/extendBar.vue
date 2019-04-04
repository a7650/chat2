<template>
    <div class="extend-bar">
        <weather></weather>
        <song></song>
    </div>
</template>

<script>
import weather from './weather/weather'
import song from './song/song'
export default {
    components:{
        weather,song
    }
}
</script>

<style lang="less" scoped>
.extend-bar{
    position: absolute;
    width: 400px;
    right: 0;
    top: 80px;
    bottom: 0;
    box-sizing: border-box;
    padding: 10px;
}
</style>
