<template>
  <div class="circle_box">
    <img src="/imgs/activity/lottery/circle0.png"
         class="circle circle0">
    <img src="/imgs/activity/lottery/circle1.png"
         class="circle circle1">
    <img src="/imgs/activity/lottery/circle2.png"
         class="circle circle2">
    <img src="/imgs/activity/lottery/circle3.png"
         class="circle circle3">

    <img src="/imgs/activity/lottery/lamp.png"
         class="decoration lamp">
    <img src="/imgs/activity/lottery/horn.png"
         class="decoration horn">
    <img src="/imgs/activity/lottery/trangle.png"
         class="decoration trangle">
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ name: 'circle-transaction' })
export default class CircleTransaction extends Vue {
}
</script>
<style lang="scss" scoped>
// 定时器时间
.circle_box {
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  overflow: hidden;
}
.circle {
  position: absolute;
  display: block;
  margin: 0 auto;
  left: 0;
  right: 0;
  opacity: 0.9;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-duration: 60s;
}
.decoration {
  position: absolute;
  pointer-events: none;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.lamp {
  top: 0;
  width: 46%;
  opacity: 0.55;
}
.horn {
  top: 0;
  width: 100%;
}
.trangle {
  width: 90%;
  top: 4%;
  opacity: 0.55;
}
.circle0 {
  $len: 100vh;
  height: $len;
  top: 45%;
  transform: translateY(-50%);
}
.circle1 {
  $len: 90;
  height: #{$len}vh;
  width: #{$len * 1.01}vh;
  top: 5%;
  animation-name: circle_b;
}
.circle2 {
  $len: 118;
  height: #{$len}vh;
  width: #{$len * 1.01}vh;
  top: -10%;
  animation-name: circle_a;
}
.circle3 {
  $len: 156;
  height: #{$len}vh;
  width: #{$len * 1.01}vh;
  top: -28%;
  animation-name: circle_b;
}
@keyframes circle_a {
  0% {
    transform: rotateZ(0);
  }
  50% {
    transform: rotateZ(-180deg);
  }
  100% {
    transform: rotateZ(-360deg);
  }
}
@keyframes circle_b {
  0% {
    transform: rotateZ(0);
  }
  50% {
    transform: rotateZ(180deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
