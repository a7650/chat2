<template>
    <transition name="login">
        <slot></slot>
    </transition>
</template>

<script>
import animated from 'animate.css'
export default {

}
</script>

<style>
.login-leave-to{
    transform: scale(.8);
    opacity: 0
}
.login-enter{
    opacity: 0;
}

</style>