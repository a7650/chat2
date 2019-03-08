<template>
    <transition name="home">
        <slot></slot>
    </transition>
</template>

<script>
import animated from 'animate.css'
export default {

}
</script>

<style>
.home-enter{
    opacity: 0;
}
.home-enter-active{
    transition: .3s;
}
</style>