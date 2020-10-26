<!--当前用户-->
<template>
  <div class="current-person-info animated" :class="animateClass" v-if="showPerson">
    <div class="info-content">
      <div class="avatar">
        <img :src="currentPerson.avatar" />
        <div class="nickname">{{ currentPerson.nickName }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
// animate
const ENTER_ANIMATE = [
  "bounceIn",
  "bounceInDown",
  "bounceInLeft",
  "bounceInRight",
  "bounceInUp",
  "fadeIn",
  "fadeInDown",
  "fadeInDownBig",
  "fadeInLeft",
  "fadeInLeftBig",
  "fadeInRight",
  "fadeInRightBig",
  "fadeInUp",
  "fadeInUpBig",
  "rotateIn",
  "rotateInDownLeft",
  "rotateInDownRight",
  "rotateInUpLeft",
  "rotateInUpRight",
  "slideInDown",
  "slideInLeft",
  "slideInRight"
];
const OUT_ANIMATE = [
  "bounceOut",
  "bounceOutDown",
  "bounceOutLeft",
  "bounceOutRight",
  "bounceOutUp",
  "fadeOut",
  "fadeOutDown",
  "fadeOutDownBig",
  "fadeOutLeft",
  "fadeOutLeftBig",
  "fadeOutRight",
  "fadeOutRightBig",
  "fadeOutUp",
  "fadeOutUpBig",
  "rotateOut",
  "rotateOutDownLeft",
  "rotateOutDownRight",
  "rotateOutUpLeft",
  "rotateOutUpRight",
  "slideOutDown",
  "slideOutLeft",
  "slideOutRight"
];
interface CurrentPerson {
  avatar: string;
  nickName: string;
}
@Component({
  name: "currentPerson"
})
export default class extends Vue {
  @Prop({ default: () => {} }) private currentPerson: CurrentPerson;
  private showPerson: boolean = false;
  animateClass: string = "";

  @Watch("currentPerson")
  onCurrentPerson() {
    this.showPerson = true;
  }

  private getSignIn() {
    let getRandom = (num: number) => {
      return Math.floor(Math.random() * num);
    };
    setTimeout(() => {
      // 进入动画
      let rand: number = getRandom(ENTER_ANIMATE.length);
      this.animateClass = ENTER_ANIMATE[rand];
      setTimeout(() => {
        // 出去动画
        this.animateClass = OUT_ANIMATE[rand];
        setTimeout(() => {
          // 停留时间
          this.animateClass = "";
          this.showPerson = false;
          // this.getSignIn();
        }, 2000);
      }, 1500);
    }, 3000);
  }
  mounted() {
    this.getSignIn();
  }
}
</script>

<style scoped lang="scss">
.current-person-info {
  position: absolute;
  top: 40%;
  left: calc(60% - 620px);
  width: 275px;
  height: 275px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(207, 100, 252, 0.5);
  background: rgba(167, 44, 236, 0.49);
  border: 3px solid #cf64fc;
  overflow: hidden;
  .info-content {
    float: left;
    margin-right: 20px;
    .avatar {
      position: relative;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      border: 6px solid #f8fab6;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
      }
      .nickname {
        position: absolute;
        bottom: -25px;
        left: -5px;
        width: 140px;
        height: 45px;
        font-size: 20px;
        line-height: 45px;
        padding: 0 10px;
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 19px;
        background: rgba(110, 0, 248, 0.7);
        font-weight: 600;
        color: #fff;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
