<template>
  <div class="page sub">
    <div class="game_wrapper"
         :style="{background:tmplCfg.mainBgColor}">
      <p class="time"
         :style="{color:tmplCfg.fontColor}">活动时间：2019.10.01 ~ 2019.10.07</p>
      <img :src="tmplCfg.title"
           class="title" />
      <!-- <div class="title">
        <span>预约即可抽奖</span>
        <span>抽取现金红包</span>
      </div> -->
      <!-- 滚动中奖名单 :Array  game.onPrize-->
      <prize-scroll v-if="tmplCfg.prizeScroll.isShow"
                    :bgColor="tmplCfg.prizeScroll.bgColor"
                    :color="tmplCfg.prizeScroll.color"></prize-scroll>
      <!-- 规则 and 奖品 -->
      <div class="btnGroup">
        <div class="btn_sm"
             :style="{backgroundColor:tmplCfg.rule.bgColor,color:tmplCfg.rule.color}">活动规则</div>
        <div class="btn_sm"
             :style="{backgroundColor:tmplCfg.prizes.bgColor,color:tmplCfg.prizes.color}">我的奖品</div>
      </div>
      <img class="topImg"
           :src="tmplCfg.top" />
      <div class="prizePeoples"
           v-if="tmplCfg.partakes.isShow"
           :style="{background:tmplCfg.partakes.bgColor,color:tmplCfg.partakes.color}">累计共123人次已中奖</div>
      <!-- 九宫格 -->
      <div class="grids_wrapper"
           :style="{background:tmplCfg.prizeView,boxShadow:'0 15px 0 '+ tmplCfg.prizeViewShadow}">
        <div class="block"
             v-for="(grids,idx) in game.prizeItemList"
             :key="idx">
          <div class="prizeWrapper"
               ref="pice"
               v-if="idx !== 4">
            <img class="prizeImg"
                 v-if="grids.name !== '再来一次' && grids.name !== '谢谢参与'"
                 :src="grids.posterUrl | formatImg" />
            <p class="prizeName">{{grids.name}}</p>
          </div>
          <div class="prizeWrapper begin"
               :style="{backgroundImage:'url(' + tmplCfg.prizeBtn.bgImg + ')'}"
               v-else>
            <p class="prizeName"
               :style="{color:tmplCfg.prizeBtn.color}">{{grids.prize}}</p>
            <p class="prizeDes"
               :style="{color:tmplCfg.prizeBtn.color}">还有3次机会</p>
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

export default {
  name: 'demo',
  props: ['tmplCfg'],
  components: {
    prizeScroll,
    increaseCount,
  },
  data() {
    return {
      game: [],
      grid: [],
      prizeUsers: 0,
      timer1: '', // 控制快速旋转的定时器
      timer2: '', // 控制慢速旋转的定时器
      prizeIndex: 0, // 转动到的位置
      arrNum: [0, 1, 2, 4, 7, 6, 5, 3], // 定义转动的顺序
      stopIndex: '', // 停止的位置
      clickFlage: true, // 是否能点击进行抽奖
      prize: '', // 奖品
      second: 0,
      findIdx: '',
      final: '',
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
      dislogText: ''
    }
  },
  filters: {
    formatImg(img) {
      if (img === '') {
        return require('@/assets/images/game/cop.png')
      } else {
        return img
      }
    }
  },
  created() {
    this.featchData()
  },
  methods: {
    async featchData() {
      this.game = {
        validFrom: 12312412,
        validTo: 6754312,
        prizeItemList: [
          {
            id: 1,
            posterUrl: '',
            name: '3000新车优惠券'
          },
          {
            id: 2,
            posterUrl: '',
            name: '全国通用500元洗车券'
          },
          {
            id: 3,
            posterUrl: '',
            name: '再来一次'
          },
          {
            id: 4,
            posterUrl: '',
            name: '居家用品'
          },
          {
            id: 5,
            posterUrl: '',
            name: '三亚半日游'
          },
          {
            id: 6,
            posterUrl: '',
            name: '谢谢参与'
          },
          {
            id: 7,
            posterUrl: '',
            name: '五年免费保养'
          },
          {
            id: 8,
            posterUrl: '',
            name: 'iphone XR'
          }
        ]
      }
      this.game.prizeItemList.splice(4, 0, {
        id: 'begin',
        img: '',
        prize: '点击抽奖'
      })
    }
  },
}

</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.game_wrapper {
  min-height: 100vh;
  padding: 60px 0;
  color: #fff;

  .topImg {
    width: 100%;
    margin-top: -210px;
  }

  .prizePeoples {
    font-size: 28px;
    background: linear-gradient(#ff9371 5%, #ff5530 80%);
    padding: 10px 20px;
    border-radius: 10px;
    width: fit-content;
    margin: 0 auto;
    margin-top: -55px;
    position: relative;
  }

  .time {
    text-align: center;
    font-size: 28px;
    color: rgba(254, 237, 189, 1);
  }

  .title {
    margin-top: 20px;
    position: relative;
    z-index: 99;
    width: 490px;
  }

  .grids_wrapper {
    background: #d72a18;
    padding: 20px;
    width: 709px;
    background: rgba(243, 85, 57, 1);
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px auto;
    box-shadow: 0 15px 0 #fa8a5e;

    .block {
      background: #fff;
      width: 205px;
      height: 200px;
      margin-right: 20px;
      margin-bottom: 20px;
      border-radius: 10px;

      &:nth-of-type(5) {
        background: none;
      }

      &:nth-of-type(3n) {
        margin-right: 0;
      }

      &:nth-of-type(7) {
        margin-bottom: 10px;
      }

      &:nth-of-type(8) {
        margin-bottom: 10px;
      }

      &:nth-of-type(9) {
        margin-bottom: 10px;
      }
    }

    .prizeWrapper {
      width: 205px;
      height: 190px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;

      &.active {
        background: #ffd33e;

        .prizeName {
          color: #444;
        }
      }

      &.begin {
        background-size: 100% 100%;
        box-shadow: none;
        width: 210px;
        height: 200px;

        &:active {
          transform: scale(1.05);
        }

        .prizeName {
          font-size: 38px;
          color: #fff;
          text-align: center;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .prizeDes {
          font-size: 16px;
          margin-top: 10px;
          text-align: center;
        }
      }

      .prizeImg {
        width: 70px;
        height: 70px;
        margin: 0 auto;
        display: block;
        object-fit: cover;
      }

      .prizeName {
        font-size: 24px;
        color: #7e3e3f;
        text-align: center;
        margin-top: 10px;
      }
    }
  }

  .btnGroup {
    position: absolute;
    right: 0;
    top: 310px;

    .btn_sm {
      margin-top: 20px;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      padding: 15px 20px;
      background: RGBA(255, 210, 64, 1);
      font-size: 26px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
