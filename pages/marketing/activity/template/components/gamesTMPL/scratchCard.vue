<template>
  <div class="page sub">
    <div class="game_wrapper"
         :style="{background:tmplCfg.mainBgColor}">
      <div class="top_wrapper"
           :style="{backgroundImage:'url(' + tmplCfg.top + ')'}">
        <!-- myPrize -->
        <div class="myPrize"
             :style="{background:tmplCfg.prizes.bgColor,color:tmplCfg.prizes.color}">我的奖品</div>
        <!-- 滚动中奖名单 :Array  game.onPrize-->
        <prize-scroll v-if="
             tmplCfg.prizeScroll.isShow"
                      :bgColor="tmplCfg.prizeScroll.bgColor"
                      :color="tmplCfg.prizeScroll.color">
        </prize-scroll>
        <div class="tip">
          <img class="ruleTip"
               :src="tmplCfg.rule" />
          <img class="titleImg"
               :src="tmplCfg.title" />
        </div>
        <p class="time"
           :style="{color:tmplCfg.fontColor}">活动时间：2019.10.01 ~ 2019.10.07</p>
        <div class="prizePeoples"
             v-if="tmplCfg.partakes.isShow"
             :style="{background:tmplCfg.partakes.bgColor,color:tmplCfg.partakes.color}">累计共1333人次已中奖</div>
      </div>

      <!-- 游戏区域 -->
      <div class="grids_wrapper">
        <div class="wrapper_c"
             :style="{backgroundColor:tmplCfg.prizeView_Outside.bgColor}">
          <p class="
             title"
             :style="{color:tmplCfg.prizeView_Outside.color}">您还剩余 3 次刮奖机会</p>
          <div class="scratchView"
               :style="{backgroundImage:'url(' + tmplCfg.prizeView_Inside.bgImg + ')'}">
            <p class="des"
               :style="{color:tmplCfg.prizeView_Inside.color}">大奖刮出来</p>
            <div id="scratch">
              <div id="card"
                   :style="{backgroundImage:'url(' + coverimg + ')'}">{{prize}}</div>
              <div class="canvas-mask"
                   v-show="showMask">
                <a id="btn"
                   href="javascript:;"
                   :style="{background:tmplCfg.prizeBtn.bgColor,color:tmplCfg.prizeBtn.color}">点击开始刮奖</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <increase-count :uiStyle="tmplCfg.prizeTask"></increase-count>
    </div>
  </div>
</template>

<script>
import prizeScroll from '../prizeScroll'
import increaseCount from '../increaseCount'
import { COVERIMG } from '../../const/coverImg.js'

export default {
  name: 'demo',
  props: ['tmplCfg'],
  components: {
    prizeScroll,
    increaseCount
  },
  data() {
    return {
      game: [],
      coverimg: COVERIMG,
      clickFlage: true, // 是否能点击进行抽奖
      showMask: true, // 显示抽奖遮罩
      prize: '谢谢参与', // 奖品
      showPop: false, // 控制弹窗显示
      popType: 'success_Coupon', // 弹窗类型 success_Coupon：中奖（优惠券）,success_Obj：中奖（实物），fail：没有次数或谢谢参与，rule：抽奖规则
      popInfos: {
        // txt: '恭喜获得1000元新车优惠券', // 主要文字,标题
        // subTxt: '领取地址：杭州市滨江区江陵路101号。', // 描述文字
        // subTxt_rele: '领取时间：2019.08.01-2019.08.30.每天9:00至18:00。',//二级描述文字 一般用于限制
        // prizeImg: require('../../../assets/img/games/failIco.png'), // 奖品图片，如奖品为优惠券 不用传
        // couponName: '￥<p class="money">2000</p><p class="des">元<br />优惠券</p>', // 优惠券面值
        // rules: '没有规则' // 中奖规则
        // noBtn: true //状态为fail时生效，是否显示按钮
      },
      page: 1,
      size: 10,
      final: '',
      findIdx: '',
      prizeUsers: 0,
      onPrizeList: [],
      newTimes: 0,
      noStartOrIsEnd: false,
      dialogBtn: [
        {
          text: '好',
          handler: () => {
            this.$loadingToast(false)
            this.$router.push({ name: 'interact' })
          }
        }
      ],
      dislogText: '',
      isWX: false
    }
  },
  created() {
    this.featchData()
  },
  mounted() {
  },
  methods: {
    featchData() {

    }
  }
}

</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.game_wrapper {
  min-height: 100vh;
  background: #e32e10;
  padding-bottom: 60px;
  color: #fff;

  .top_wrapper {
    background: url("../../../../../../assets/images/game/scratch_top.png");
    background-size: cover;
    background-position: center 100%;
    width: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 20px;
    padding-top: 230px;

    .myPrize {
      background: #ffeb3f;
      color: #ff302d;
      width: 137px;
      font-size: 30px;
      height: 78px;
      position: absolute;
      right: 30px;
      top: 0;
      font-weight: bold;
      line-height: 78px;
      text-align: center;
      border-bottom-right-radius: 30px;
      border-bottom-left-radius: 30px;
    }

    .tip {
      position: relative;
      margin-top: 100px;

      .ruleTip {
        position: absolute;
        width: 130px;
        top: -100px;
        left: 100px;
      }

      .titleImg {
        width: 600px;
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
      }
    }

    .prizePeoples {
      font-size: 28px;
      background: linear-gradient(#ff9371 5%, #ff5530 80%);
      padding: 10px 20px;
      border-radius: 10px;
      width: fit-content;
      margin: 0 auto;
      margin-top: 15px;
    }

    .time {
      text-align: center;
      font-size: 25px;
      color: rgba(254, 237, 189, 1);
    }
  }

  .grids_wrapper {
    padding: 10px;
    width: 709px;
    margin: 20px auto;
    margin-top: 0;

    .wrapper_c {
      min-height: 300px;
      background-color: #fff2cb;
      padding: 30px 20px;

      .title {
        font-size: 30px;
        color: #722e18;
        line-height: 39px;
        text-align: center;
        font-weight: bold;
      }

      .scratchView {
        margin-top: 30px;
        background-image: url("../../../../../../assets/images/game/scratch_card.png");
        background-size: cover;
        padding: 30px;

        .des {
          font-size: 32px;
          letter-spacing: 1px;
          text-align: center;
          margin-bottom: 20px;
          font-weight: bold;
        }
      }
    }
  }
}

#cover {
  position: absolute;
  top: 0;
  left: 0;
}

#card {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 100%;
  width: 100%;
  font-weight: bold;
  font-size: 32px;
  line-height: 210px;
  text-align: center;
  background-color: linear-gradient(to right bottom, #ff9371 5%, #ff5530 80%);
  background-size: cover;
}

#scratch {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: 210px;
  margin: 30px auto 0;

  .canvas-mask {
    background: rgba(0, 0, 0, 0);
    position: absolute;
    height: 210px;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: jump 2s infinite;

    a {
      font-size: 26px;
      background: linear-gradient(to right bottom, #ff9371 5%, #ff5530 80%);
      color: #fff;
      padding: 10px 20px;
      border-radius: 7px;
      text-align: center;
    }
  }
}

@keyframes jump {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.1);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
