<template>
  <div class="bomb_box">
    <div class="unit_nodes"
         v-for="(item,x) in _avatarList"
         :key="x"
         :class="`lottery_bomb_${x % positionArr.length}`">
      <img :src="item.avatar"
           class="avatar"
           v-if="item.avatar" />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { signList } from "@/api";

@Component
export default class LotteryBomb extends Vue {
  @PropSync('avatarList', { type: Array, default: () => [] }) _avatarList: any;
  readonly positionArr = [
    '-1200, -800',
    '-600, 800',
    '0, 800',
    '600, 800',
    '1200, 800',
    '-1200, 400',
    '-600, 400',
    '0, 400',
    '600, 400',
    '1200, 400',
    '-1200, 0',
    '-600, 0',
    '0, 0',
    '600, 0',
    '1200, 0',
    '-1200, -400',
    '-600, -400',
    '0, -400',
    '600, -400',
    '1200, -400',
    '-600, -800',
    '0, -800',
    '600, -800',
    '1200, -800',
    '-600, 800',
    '-600, 400'
  ];
  setRule() {
    let rule;
    let ss: any = document.styleSheets;
    let count = 0;
    // loop through all the rules!
    for (let t = 0; t < this.positionArr.length; t++) {
      if (ss[0].cssRules[`lottery_bomb_${count}`]) {
        continue;
      }
      if (count > this.positionArr.length) {
        count = 0;
      }
      ss[0].insertRule(`.lottery_bomb_${count} {animation-name: lottery_bomb_${count};animation-delay: ${Math.random() * 10}s;}`);

      ss[0].insertRule(`@keyframes lottery_bomb_${count} { 0% {opacity:1;padding: 50px;transform: translate3d(-50%, -50%, 0px) matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, ${this.positionArr[t]}, -300, 1);}100% {opacity:1;padding: 50px;transform: translate3d(-50%, -50%, 0px) matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, ${this.positionArr[t]}, -6, 1);}}`);

      count++;
    }
  };

  async signList() {
    try {
      const releaseId: any = this.$route.query.releaseId || '';
      let { data } = await signList(releaseId);
      if (data.length > 0) {
        while (data.length < 70) {
          data = [...data, ...data]
        }
        this._avatarList = data;
      } else {
        this.showMsg('暂无签到信息', 'warning');
      }
    } catch (e) {
      this.log(e)
    }
  };
  created() {
    this.signList();
    this.setRule();
  }
}
</script>
<style lang="scss" scoped>
.bomb_box {
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  border: 1px solid black;
  perspective: 10;
  transform-style: preserve-3d;
}
.unit_nodes {
  position: absolute;
  opacity: 0;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 3s;
}
.avatar {
  width: 100%;
}
</style>
