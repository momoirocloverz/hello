<template>
  <div class="lottery_screen">
    <fullScreenBtn />
    <circleTransaction />
    <lotteryBomb v-show="timeToShowBomb"
                 :avatarList.sync="avatarList" />
    <luckyGuys :startMoveRight="startMoveRight"
               v-if="timeToShowLucker"
               :currentLuckyGroup.sync="currentLuckyGroup" />

    <div class="shadow_box rewards"
         :class="{'rewards_hang':startGame}">
      <div class="title_pic">
        <img src="/imgs/activity/lottery/title_pic.png">
      </div>
      {{activeRegardIndex}}
      <div class="target"
           v-for="(item, x) in rewardsList"
           :key="x"
           v-show="activeRegardIndex === x">
        <img :src="rewardsList[activeRegardIndex].posterUrl">
      </div>
      <div class="btn_group"
           v-if="rewardsList.length>0">
        <img src="/imgs/activity/lottery/arrow-left.png"
             class="btn_pic"
             @click.stop="preReward">
        <span class="reward_name">{{rewardsList[activeRegardIndex].levelTitle}}</span>
        <img src="/imgs/activity/lottery/arrow-right.png"
             class="btn_pic"
             @click.stop="nextReward">
      </div>
      <div class="start_game">
        <img src="/imgs/activity/lottery/start_btn.png"
             :class="{'disabled':disabled}"
             @click.stop="startLuckyDraw">
      </div>
    </div>

    <div class="shadow_box lucky_audience"
         :class="{'lucky_audience_hang':startGame}">
      <div class="list_head">
        <img src="/imgs/activity/lottery/lucky-ones.png">
      </div>
      <div class="list_all">
        <div class="list_part"
             v-for="(luckyGuysGroup, t) in LuckyGuysList"
             :key="t"
             v-show="luckyGuysGroup.levelTitle === rewardsList[activeRegardIndex].levelTitle">
          <template v-if="luckyGuysGroup.list.length>0">
            <p class="list_title">{{luckyGuysGroup.levelTitle}}</p>
            <div class="list_detail">
              <div class="list_item"
                   v-for="(item,x) in luckyGuysGroup.list"
                   :key="x">
                <img :src="item.avatar || item.userAvatar">
                <p class="list_item_name">
                  <span>{{item.name || item.userName}}</span>
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="bottom_start">
      <!-- <img src="/imgs/activity/lottery/start_btn.png"
           v-if="!startGame"
           @click.stop="goStartGame"> -->
      <img src="/imgs/activity/lottery/pause.png"
           v-if="showPauseBtn"
           @click.stop="pauseGame">
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import circleTransaction from "./components/circle-transaction.vue";
import lotteryBomb from "./components/lottery-bomb.vue";
import luckyGuys from "./components/lucky_guys.vue";
import fullScreenBtn from "./components/full-screen-btn.vue";
import { storeInfoSetting } from "@/utils/userSetting";
import { getPriceList, campaignWinner, campaignLuckyDraw } from "@/api";
interface CurrentLuckyGroup {
  list?: any[];
  levelTitle?: string;
  disabled?: boolean
}
@Component({
  name: "lottery-draw",
  components: {
    circleTransaction,
    lotteryBomb,
    luckyGuys,
    fullScreenBtn
  },
})
export default class LotteryDraw extends Vue {
  startGame: boolean = false;
  startMoveRight: boolean = false;
  activeRegardIndex: number = 0;
  rewardsList: any = [];
  LuckyGuysList: any = [];
  currentLuckyGroup: CurrentLuckyGroup = {};
  pendingLuckyDraw: boolean = false; // 等待抽奖
  timeToShowLucker: boolean = false;
  timeToShowBomb: boolean = false;
  showPauseBtn: boolean = false;
  avatarList: any[] = [];
  get currentReward() {
    return this.rewardsList[this.activeRegardIndex]
  }
  get disabled() {
    const { LuckyGuysList } = this;
    const i = this.activeRegardIndex;
    return LuckyGuysList[i] && LuckyGuysList[i].disabled;
  }
  /**
   * @description 上一个奖品
   */
  preReward() {
    try {
      if (this.pendingLuckyDraw) return;
      --this.activeRegardIndex;
      if (this.activeRegardIndex < 0) {
        this.activeRegardIndex = this.rewardsList.length - 1
      }
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 下一个奖品
   */
  nextReward() {
    try {
      if (this.pendingLuckyDraw) return;
      ++this.activeRegardIndex;
      if (this.activeRegardIndex > this.rewardsList.length - 1) {
        this.activeRegardIndex = 0
      }
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 获取奖品列表
   */
  async getPriceList() {
    try {
      const { releaseId } = this.$route.query;
      const activeType = 'lottery';
      const params = {
        activeType,
        id: releaseId
      }
      const { data } = await getPriceList(params);
      this.rewardsList = data || [];
      this.campaignWinner();
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 获取已经中奖的人列表
   */
  async campaignWinner() {
    try {
      const { id, sysPlat } = this.$route.query;
      let params: any = {
        campaignId: id
      };
      if (sysPlat === 'agent') {
        params.dealerCode = storeInfoSetting.getInfo().dealerCode
      }
      const { data } = await campaignWinner(params);
      let titles: string[] = [];
      let tmpLuckyList: any = new Array(this.rewardsList.length);
      this.rewardsList.forEach((ele: any, i: number) => {
        tmpLuckyList[i] = {}
        if (titles.indexOf(ele.levelTitle) < 0) {
          titles.push(ele.levelTitle)
        }
      });
      if (data) {
        titles.forEach((e, i: number) => {
          tmpLuckyList[i].levelTitle = e;
          tmpLuckyList[i].list = [];
          data.forEach((ele: any) => {
            if (ele.prizeLevel === e) {
              tmpLuckyList[i].list.push(ele)
            }
          })
          // 获取list 后确定disabled
          tmpLuckyList[i].disabled = tmpLuckyList[i].list > 0;
        })
      }
      this.LuckyGuysList = tmpLuckyList;
    } catch (e) {
      this.log(e)
    }
  };
  startLuckyDraw() {
    try {
      if (this.avatarList.length < 1) {
        return this.showMsg('暂无可抽奖名单', 'warning')
      }
      const { LuckyGuysList } = this;
      const i = this.activeRegardIndex;
      if (LuckyGuysList[i].disabled) return;
      if (LuckyGuysList[i].list.length > 0) {
        this.showMsg('当前奖品已经抽过啦', 'warning');
        return
      }
      LuckyGuysList[i].disabled = true;
      this.startMoveRight = false;
      this.timeToShowLucker = false;
      this.timeToShowBomb = true;
      this.startGame = true;
      if (this.pendingLuckyDraw) return;
      this.pendingLuckyDraw = true;
      // 去抽奖
      setTimeout(this.campaignLuckyDraw, 2000);
    } catch (e) {
      this.log(e)
    }
  };
  /**
   * @description 后台抽奖返回中奖名单
   */
  async campaignLuckyDraw() {
    try {
      const { releaseId } = this.$route.query;
      const params = {
        prizePoolItemId: this.currentReward.itemId,
        releaseId,
      };
      const { data } = await campaignLuckyDraw(params);
      this.formatDataInPage(data)
    } catch (e) {
      this.showPauseBtn = true;
      this.pendingLuckyDraw = false;
      this.log(e)
    }
  };
  /**
   * 设置动画时间
   */
  formatDataInPage(data: any) {
    try {
      this.currentLuckyGroup = {
        levelTitle: this.currentReward.levelTitle,
        list: data || [],
        disabled: true
      }
      setTimeout(() => {
        this.timeToShowLucker = true;
      }, 2000);
      setTimeout(() => {
        this.startMoveRight = true;
      }, 4000);
      setTimeout(() => {
        // 替换已有的luckyGuy空组
        this.LuckyGuysList.splice(this.activeRegardIndex, 1, { ...this.currentLuckyGroup });
        this.pauseGame();
      }, 10500);
    } catch (e) {
      this.log(e)
    }
  }
  /**
   * @description 结束
   */
  pauseGame() {
    this.timeToShowBomb = !1;
    this.timeToShowLucker = !1;
    this.pendingLuckyDraw = !1;
    this.startGame = !1;
    this.showPauseBtn = !1;
  };

  created() {
    this.getPriceList();
  }
}
</script>
<style lang="scss" scoped>
@import "./style/lottery-screen.scss";
.disabled {
  cursor: not-allowed !important;
}
</style>
