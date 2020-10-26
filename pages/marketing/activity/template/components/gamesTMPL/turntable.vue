<template>
  <div class="page sub"
       :style="{background:tmplCfg.mainBgColor}">
    <div class="turntable"
         :style="{backgroundImage:'url(' + tmplCfg.top + ')'}">
      <p class="title-img"
         :style="{backgroundImage:'url(' + tmplCfg.title + ')'}"></p>
      <p class="duration"
         :style="{color:tmplCfg.fontColor}">活动时间：2019.10.01 ~ 2019.10.07</p>
      <!-- 滚动中奖名单 :Array -->
      <prize-scroll v-if="tmplCfg.prizeScroll.isShow"
                    :bgColor="tmplCfg.prizeScroll.bgColor"
                    :color="tmplCfg.prizeScroll.color">
      </prize-scroll>
      <div class="turntable-content">
        <div class="rotate"
             :style="{backgroundColor:tmplCfg.prizeView.bgColor_outSide}">
          <div class="prize-wheel geely-flex geely-flex-col-center geely-space-between"
               :style="{backgroundImage:isLight ? 'url(' + tmplCfg.prizeView.bgImg_outSide_one + ')' : 'url(' + tmplCfg.prizeView.bgImg_outSide_two + ')'}">
            <canvas class="prize"
                    :style="{transform:`rotate(${angle}deg)`, transitionDuration: transitionDuration}"
                    id="wheelcanvas"
                    width="560px"
                    height="560px"></canvas>
          </div>
          <div class="start-btn"
               :style="{backgroundImage:'url(' + tmplCfg.prizeView.prizeBtn + ')'}"></div>
        </div>
        <div class="activity-rule"
             :style="{backgroundImage:'url(' + tmplCfg.rule + ')'}"></div>
        <div class="my-prize"
             :style="{backgroundImage:'url(' + tmplCfg.prizes + ')'}"></div>
      </div>
      <div class="shadow"
           :style="{backgroundImage:'url(' + tmplCfg.prizeView.prizeShadow + ')'}"></div>
      <div class="left-count"
           :style="{backgroundColor:tmplCfg.prizeChance.bgColor,color:tmplCfg.prizeChance.color,borderColor:tmplCfg.prizeChance.borderColor}">今日抽奖机会x3</div>
      <increase-count :uiStyle="tmplCfg.prizeTask"></increase-count>
    </div>
    <!-- 用以绘制canvas -->
    <img :src="item.posterUrl | formatImg"
         v-for="(item,index) in game.prizeItemList"
         :key="index"
         :id="item.itemId"
         @load="imageLoaded(index)"
         style="display:none;"
         class="prizeImg" />
  </div>
</template>

<script>
import prizeScroll from '../prizeScroll'
import increaseCount from '../increaseCount'
import dayjs from 'dayjs'

export default {
  name: 'turntable',
  props: ['tmplCfg'],
  components: {
    prizeScroll,
    increaseCount
  },
  computed: {
  },
  data() {
    return {
      game: {},
      onPrizeList: [],
      isLight: false,
      timer: null,
      angle: 0,
      transitionDuration: '4s', // 旋转时间
      isDrawing: false, // 是否正在抽奖
      colors: [], // canvas奖品区块对应背景颜色
      outsideRadius: 280, // canvas外圆的半径
      textRadius: 210, // canvas奖品位置距离圆心的距离
      insideRadius: 0, // canvas内圆的半径
      startAngle: 0, // canvas开始角度
      lastActiveIndex: 0, // 是否第一次点击,
      prizeList: [], // 中奖名单
      showPop: false, // 控制弹窗显示
      popType: '', // 弹窗类型 success：中奖，fail：没有次数或谢谢参与，rule：抽奖规则
      popInfos: {
        // txt: '恭喜获得1000元新车优惠券<br/>请前往领取', // 主要文字
        // subTxt: '有效期：2019.7.1 - 2019.8.1<br />仅限帝豪GS系列使用', // 描述文字
        // prizeImg: require('../../../assets/img/games/failIco.png'), // 奖品图片，如奖品为优惠券 不用传
        // isCoupon: true, // 奖品是否是优惠券
        // couponName: '2000元优惠券', // 优惠券面值
        // rules: '没有规则' // 中奖规则
      },
      surplusTime: null, // 可以点击的剩余次数
      page: 1,
      size: 10,
      findIdx: '',
      final: '',
      noStartOrIsEnd: false,
      dialogBtn: [
        {
          text: '好',
          handler: () => {
            this.$router.push({ name: 'interact' })
          }
        }
      ],
      dislogText: '',
      isWX: false,
      fontColor: '#CA1518'
    }
  },
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY.MM.DD')
    },
    formatImg(img) {
      if (img === null || img === 'null') {
        return ''
      } else if (img === '') {
        return require('../../../../../../assets/images/game/cop.png')
      } else {
        return img
      }
    }
  },
  created() {
    this.initWheel()
    this.featchData(this.tmplCfg.prizeView.bgColor_InSide_one, this.tmplCfg.prizeView.bgColor_InSide_two)
  },
  watch: {
    tmplCfg: {
      handler(newVal, oldVal) {
        this.featchData(this.tmplCfg.prizeView.bgColor_InSide_one, this.tmplCfg.prizeView.bgColor_InSide_two)
        this.drawRouletteWheel(this.tmplCfg.prizeView.color)
      },
      deep: true
    }
  },
  methods: {
    async featchData(one, two) {
      this.game = {
        validFrom: 12312412,
        validTo: 6754312,
        prizeItemList: [
          {
            itemId: 1,
            posterUrl: '',
            name: '3000新车优惠券'
          },
          {
            itemId: 2,
            posterUrl: '',
            name: '500元洗车券'
          },
          {
            itemId: 3,
            posterUrl: '',
            name: '再来一次'
          },
          {
            itemId: 4,
            posterUrl: '',
            name: '居家用品'
          },
          {
            itemId: 5,
            posterUrl: '',
            name: '三亚半日游'
          },
          {
            itemId: 6,
            posterUrl: '',
            name: '谢谢参与'
          },
          {
            itemId: 7,
            posterUrl: '',
            name: '免费保养'
          },
          {
            itemId: 8,
            posterUrl: '',
            name: 'iphone XR'
          }
        ]
      }
      for (let i = 0; i < this.game.prizeItemList.length; i += 2) {
        this.colors[i] = one
        this.colors[i + 1] = two
      }
      this.startAngle = -(Math.PI / 2 + Math.PI / this.game.prizeItemList.length)
    },
    // 做初始化动作  画布初始化
    imageLoaded(index) {
      this.$nextTick(() => {
        this.drawRouletteWheel(this.fontColor)
      })
    },
    initWheel() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.isLight = !this.isLight
      }, 500)
    },
    drawRouletteWheel(fontColor) {
      const canvas = document.getElementById('wheelcanvas')
      canvas.addEventListener('transitionend', () => {
        this.findPrize() // 结束
      })
      if (canvas.getContext) {
        // 根据奖品个数计算圆周角度
        const arc = Math.PI / (this.game.prizeItemList.length / 2)
        const ctx = canvas.getContext('2d')

        // 在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 560, 560)

        // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = '#ffbf00'

        // font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '24px Microsoft YaHei'
        for (let i = 0; i < this.game.prizeItemList.length; i++) {
          const angle = this.startAngle + i * arc
          ctx.fillStyle = this.colors[i]
          ctx.beginPath()

          // arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(
            280,
            280,
            this.outsideRadius,
            angle,
            angle + arc,
            false
          )
          ctx.arc(280, 280, this.insideRadius, angle + arc, angle, true)
          ctx.stroke()
          ctx.fill()

          // 锁画布(为了保存之前的画布状态)
          ctx.save()

          // ----绘制奖品开始----
          ctx.fillStyle = fontColor
          const prize = this.game.prizeItemList[i].name

          // translate方法重新映射画布上的 (0,0) 位置
          ctx.translate(
            280 + Math.cos(angle + arc / 2) * this.textRadius,
            280 + Math.sin(angle + arc / 2) * this.textRadius
          )

          // rotate方法旋转当前的绘图
          ctx.rotate(angle + arc / 2 + Math.PI / 2)

          // 渲染文本
          ctx.fillText(prize, -ctx.measureText(prize).width / 2, 0)

          /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
          // if (text.indexOf('M') > 0) {
          //   // 流量包
          //   const texts = text.split('M')
          //   for (let j = 0; j < texts.length; j++) {
          //     ctx.font =
          //       j === 0 ? 'bold 20px Microsoft YaHei' : '32px Microsoft YaHei'
          //     if (j === 0) {
          //       ctx.fillText(
          //         texts[j] + 'M',
          //         -ctx.measureText(texts[j] + 'M').width / 2,
          //         j * lineHeight
          //       )
          //     } else {
          //       ctx.fillText(
          //         texts[j],
          //         -ctx.measureText(texts[j]).width / 2,
          //         j * lineHeight
          //       )
          //     }
          //   }
          // } else if (text.indexOf('M') === -1 && text.length > 6) {
          //   // 奖品名称长度超过一定范围
          //   text = text.substring(0, 6) + '||' + text.substring(6)
          //   const texts = text.split('||')
          //   for (let j = 0; j < texts.length; j++) {
          //     ctx.fillText(
          //       texts[j],
          //       -ctx.measureText(texts[j]).width / 2,
          //       j * lineHeight
          //     )
          //   }
          // } else {
          //   // 在画布上绘制填色的文本。文本的默认颜色是黑色
          //   // measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
          //   ctx.fillText(text, -ctx.measureText(text).width / 2, 0)
          // }

          // 添加对应图标
          const img = document.getElementById(this.game.prizeItemList[i].itemId)
          img.onload = () => {
            ctx.drawImage(img, -25, 30, 50, 50)
          }
          ctx.drawImage(img, -25, 30, 50, 50)

          // 把当前画布返回（调整）到上一个save()状态之前
          ctx.restore()
          // ----绘制奖品结束----
        }
      }
    },
    closePop() {
      this.showPop = false
    },
    goBuyCar() {
      this.$router.push({ name: 'buyCar' })
    },
    // 滚动页面至底部
    scrollToBottom() {
      this.showPop = false
      let timer = setTimeout(() => {
        this.$refs.scrollView.scrollTo(0, (document.querySelector('.scroll-view-container').clientHeight - this.$refs.scrollView.$el.clientHeight), true)
        clearTimeout(timer)
      }, 500)
    },
    openFailPop() {
      this.popType = 'fail'
      if (this.game.taskList.length > 0) {
        this.popInfos = {
          txt: `今日抽奖机会已用完`, // 主要文字
          subTxt: `快去做任务获得更多抽奖机会`,
          failImg: 1
        }
      } else {
        this.popInfos = {
          txt: `今日抽奖机会已用完`, // 主要文字
          subTxt: `明天再来吧~`,
          failImg: 0
        }
      }
      this.showPop = true
    },
    async findPrize() {
      // 获取中奖奖品
      if (this.final) {
        let res = await this.$api.mall.get(`campaign/luckydraw/trophy/${this.final}`)
        if (res.code === '000000') {
          this.openPrizePop(res.data)
        }
      } else {
        if (this.game.prizeItemList[this.findIdx].prizeId === -1) {
          this.popType = 'fail'
          this.popInfos = {
            txt: `没有中奖`, // 主要文字
            failImg: 2
          }
          this.showPop = true
        } else {
          this.popType = 'success_Again'
          this.popInfos = {}
          this.showPop = true
        }
      }
      this.isDrawing = false
    },
    openPrizePop(prize) {
      if (prize.prizeType === 0) {
        if (prize.receiveMeans === 'ON_SITE') {
          this.popType = 'success_Obj'
          this.popInfos = {
            txt: `${prize.name}`, // 主要文字
            subTxt: `领取地址：${prize.location || '暂无'}`, // 描述文字
            subTxt_rele: `领取时间：${dayjs(prize.validFrom).format('YYYY.M.D')} - ${dayjs(prize.validTo).format('YYYY.M.D')} 每天9:00至18:00`,
            prizeImg: `${prize.posterUrl}`, // 奖品图片
            needMail: false
          }
        } else {
          this.popType = 'success_Obj'
          this.popInfos = {
            txt: `${prize.name}`, // 主要文字
            prizeImg: `${prize.posterUrl}`, // 奖品图片
            needMail: true,
            tID: prize.trophyId
          }
        }
      } else if (prize.prizeType === 1) {
        this.popType = 'success_Coupon'
        let desc = '全场通用'
        if (prize.modelNames !== null) {
          if (prize.modelNames.length > 1) {
            desc = '仅限' + prize.modelNames[0] + '等车型使用'
          } else {
            desc = '仅限' + prize.modelNames[0] + '使用'
          }
        }
        this.popInfos = {
          txt: `恭喜获得${prize.name}`, // 主要文字
          subTxt: `有效期：${dayjs(prize.validFrom).format('YYYY.M.D')} - ${dayjs(prize.validTo).format('YYYY.M.D')}`, // 描述文字
          subTxt_rele: prize.receiveMeans === 'ON_SITE',
          couponName: `${prize.couponType === 0 ? `￥<p class="money">${prize.discountValue}</p>优惠券<p class="des">${prize.receiveMeans === 'ON_SITE' ? '线下' : '线上'}</p>` : `<p class="money">${prize.discountRatio * 10}</p>折 折扣券<p class="des">${prize.receiveMeans === 'ON_SITE' ? '线下' : '线上'}</p>`}` // 优惠券面值
        }
      }
      this.showPop = true
    },
    goMall() {
      this.$router.push({ name: 'onlineMall' })
    },
    addAddress(id) { // 添加收货地址
      this.$localDB.save('chooseAddressPage', 'turntable')
      this.$router.push({ name: 'shoppingAddress', query: { id: id, activityId: this.$route.query.id } })
    }
  }
}

</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  background-color: #e81614;

  .turntable {
    padding-top: 64px;
    padding-bottom: 60px;
    background-repeat: no-repeat;
    background-position: 0% 0%;
    background-size: 100% auto;
    background-image: url("../../../../../../assets/images/game/turntable_bg.png");

    .title-img {
      margin: 0 auto 24px;
      width: 628px;
      height: 136px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url("../../../../../../assets/images/game/turntable_title.png");
    }

    .duration {
      // margin-bottom 30px
      font-size: 24px;
      font-family: AlibabaPuHuiTiR;
      font-weight: bold;
      color: rgba(254, 237, 189, 1);
      text-align: center;
    }

    .turntable-content {
      position: relative;

      .rotate {
        position: relative;
        margin: 200px auto 0px;
        width: 632px;
        height: 632px;
        background-color: #ffbf00;
        border-radius: 50%;
        padding: 8px;

        .prize-wheel {
          position: relative;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-image: url("../../../../../../assets/images/game/turntable_light.png");

          &.light {
            background-image: url("../../../../../../assets/images/game/turntable_black.png");
          }

          .prize {
            position: relative;
            margin: 0px auto;
            overflow: hidden;
            width: 560px;
            height: 560px;
            border-radius: 50%;
            border: 1px solid #ef9708;
            transition-property: all;
            margin-top: 30px;
          }
        }

        .start-btn {
          position: absolute;
          left: 242px;
          top: 174px;
          width: 148px;
          height: 216px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-image: url("../../../../../../assets/images/game/turntable_btn.png");

          &:active {
            opacity: 0.9;
          }
        }
      }

      .activity-rule,
      .my-prize {
        position: absolute;
        font-weight: bold;
        color: #fff;
        font-family: FZLTZHK--GBK1-0;
        font-style: italic;
        line-height: 42px;
        text-shadow: 1px 2px 2px rgba(115, 100, 16, 0.76);
      }

      .activity-rule {
        left: 52px;
        top: -46px;
        width: 128px;
        height: 144px;
        font-size: 28px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url("../../../../../../assets/images/game/turntable_rule.png");

        &:active {
          opacity: 0.9;
        }
      }

      .my-prize {
        right: 38px;
        top: -140px;
        width: 160px;
        height: 176px;
        font-size: 34px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url("../../../../../../assets/images/game/turntable_my_prize.png");

        &:active {
          opacity: 0.9;
        }
      }

      .left-cloud {
        position: absolute;
        left: 0px;
        top: 70px;
        width: 184px;
        height: 162px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url("../../../../../../assets/images/game/turntable_left_cloud.png");
      }

      .right-cloud {
        position: absolute;
        right: 0px;
        top: 42px;
        width: 232px;
        height: 174px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url("../../../../../../assets/images/game/turntable_right_cloud.png");
      }

      .left-bg {
        position: absolute;
        left: 0px;
        top: 264px;
        width: 40px;
        height: 74px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url("../../../../../../assets/images/game/turntable_left_bg.png");
      }

      .right-bg {
        position: absolute;
        right: 0px;
        top: 530px;
        width: 74px;
        height: 74px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url("../../../../../../assets/images/game/turntable_right_bg.png");
      }
    }

    .shadow {
      margin: -48px auto 0px;
      width: 530px;
      height: 74px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url("../../../../../../assets/images/game/turntable_shadow.png");
    }

    .left-count {
      margin: 0px auto;
      width: 396px;
      background: rgba(250, 69, 29, 1);
      border: 9px solid rgba(255, 224, 169, 1);
      border-radius: 38px;
      font-size: 30px;
      font-family: AlibabaPuHuiTiH;
      font-weight: bold;
      color: #fff;
      line-height: 58px;
      text-align: center;
    }
  }
}

@keyframes initRotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
