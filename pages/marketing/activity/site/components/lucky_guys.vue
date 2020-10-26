<template>
  <div class="lucky_guys lottery__lucky">
    <div class="lucky__inner dfc"
         :class="{'before_right': beforeRight,'stand_right':standRight,'hidden': hiddenInner}">
      <template v-if="currentLuckyGroup.list">
        <div v-for="(item, t) in currentLuckyGroup.list"
             :key="t"
             class="lucky__item dfc"
             :class="`lottery_lucky_${t}`">
          <div class="lucky__content">
            <img :src="item.avatar">
            <div class="lucky__name">
              {{item.name}}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';

@Component
export default class LuckyGuys extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  }) currentLuckyGroup: any;
  @Prop({ type: Boolean, default: false }) startMoveRight: boolean;
  @Prop({ type: Number, default: 6 }) endSeconds: number;

  readonly animationCount: number = 10;
  standRight: boolean = false;
  hiddenInner: boolean = false;
  beforeRight: boolean = false;

  @Watch('startMoveRight')
  move2Right() {
    setTimeout(() => {
      this.beforeRight = true;
    }); // 延迟0s，执行2s = 4s

    setTimeout(() => {
      this.standRight = true;
    }, (this.endSeconds - 2) * 1000); // 延迟0s + 2s观看, 执行2s  = 4s

    setTimeout(() => {
      this.hiddenInner = true;
    }, this.endSeconds * 100); // 延迟4s，执行2s = 6s
  };
  setRule() {
    let rule;
    let ss: any = document.styleSheets;
    // loop through all the rules!
    for (let t = 0; t < this.animationCount; t++) {
      if (ss[0].cssRules[`lottery_lucky_${t}`]) {
        continue;
      }
      ss[0].insertRule(`.before_right .lottery_lucky_${t} {animation: lottery_lucky 2s ease-in-out ${Math.random() / 2}s;`);
    }
  };
  created() {
    this.setRule();
  }
}
</script>
<style lang="scss">
.lottery__lucky {
  pointer-events: none;
  .dfc {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.lucky_guys {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .lucky__inner {
    height: 50%;
    width: 60%;
    background: rgba($color: #000000, $alpha: 0.6);
    border-radius: 1rem;
    flex-wrap: wrap;
    justify-content: left;
    animation: lucky__inner 2s ease-in forwards;
  }

  @keyframes lucky__inner {
    0% {
      transform: scale(0.2) rotateZ(0);
    }
    100% {
      transform: scale(1) rotateZ(1080deg);
    }
  }
  .lucky__content {
    width: 80%;
    height: 80%;
    color: #fff;
    text-align: center;
  }
  .lucky__item {
    width: 20%;
    height: 35%;
    img {
      max-width: 80%;
      min-height: 80%;
    }
  }
  @keyframes lottery_lucky {
    0% {
      transform: rotateY(0);
    }
    100% {
      transform: rotateY(1440deg);
    }
  }
  .stand_right {
    background: none;
    .lucky__item {
      position: relative;
      animation: stand_right 2s ease-in-out forwards;
    }
  }
  @keyframes stand_right {
    0% {
      left: 0;
      top: 0;
    }
    100% {
      opacity: 0.5;
      height: 10px;
      width: 10px;
      overflow: hidden;
      left: 120%;
      top: -60%;
    }
  }
}
</style>
