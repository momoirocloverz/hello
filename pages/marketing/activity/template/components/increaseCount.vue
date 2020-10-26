<template>
  <div class="increase-count">
    <div v-for="(item,idx) in list"
         :key="idx"
         class="taskItem">
      <div class="item appointment geely-flex-column geely-space-between geely-flex"
           :style="{backgroundImage:'url(' + uiStyle.bgImg + ')'}"
           v-if="item.taskType === 'TEST_DRIVE'">
        <div class="title-wrapper geely-flex-row-center geely-flex"
             :style="{background:uiStyle.taskTitle.bgColor}">
          <div class="before"
               :style="{background:uiStyle.taskTitle.color}"></div>
          <p class="title"
             :style="{color:uiStyle.taskTitle.color}">预约试驾</p>
          <div class="after"
               :style="{background:uiStyle.taskTitle.color}"></div>
        </div>
        <p class="intro"
           :style="{color:uiStyle.taskTitle.color}">预约试驾1次，可获得1次刮奖机会</p>
        <p class="info"
           v-if="item.chanceMode === 'DAILY'">每个账号每天仅限{{item.chanceTimes}}次</p>
        <p class="info"
           v-else>活动期间仅限{{item.chanceTimes}}次</p>
        <p class="btn"
           :style="{backgroundImage:'url(' + uiStyle.taskBtn.bgImg + ')',color:uiStyle.taskBtn.color}">去预约</p>
      </div>
      <div class="item reserve geely-flex-column geely-space-between geely-flex"
           :style="{backgroundImage:'url(' + uiStyle.bgImg + ')'}"
           v-if="item.taskType === 'RESERVATION_ONLINE'">
        <div class="title-wrapper geely-flex-row-center geely-flex"
             :style="{background:uiStyle.taskTitle.bgColor}">
          <div class="before"
               :style="{background:uiStyle.taskTitle.color}"></div>
          <p class="title"
             :style="{color:uiStyle.taskTitle.color}">新车预订</p>
          <div class="after"
               :style="{background:uiStyle.taskTitle.color}"></div>
        </div>
        <p class="intro"
           :style="{color:uiStyle.taskTitle.color}">预约预订新车，可获得1次刮奖机会</p>
        <p class="info"
           v-if="item.chanceMode === 'DAILY'">每个账号每天仅限{{item.chanceTimes}}次</p>
        <p class="info"
           v-else>活动期间仅限{{item.chanceTimes}}次</p>
        <p class="btn"
           :style="{backgroundImage:'url(' + uiStyle.taskBtn.bgImg + ')',color:uiStyle.taskBtn.color}">去预订</p>
      </div>
      <div class="item share geely-flex-column geely-space-between geely-flex"
           :style="{backgroundImage:'url(' + uiStyle.bgImg + ')'}"
           v-if="item.taskType === 'INVITATION'">
        <div class="title-wrapper geely-flex-row-center geely-flex"
             :style="{background:uiStyle.taskTitle.bgColor}">
          <div class="before"
               :style="{background:uiStyle.taskTitle.color}"></div>
          <p class="title"
             :style="{color:uiStyle.taskTitle.color}">邀请好友</p>
          <div class="after"
               :style="{background:uiStyle.taskTitle.color}"></div>
        </div>
        <p class="intro"
           :style="{color:uiStyle.taskTitle.color}">每邀请一个新注册用户，即可获得1次抽奖机会</p>
        <p class="info"
           v-if="item.chanceMode === 'DAILY'">每个账号每天仅限{{item.chanceTimes}}次</p>
        <p class="info"
           v-else>活动期间仅限{{item.chanceTimes}}次</p>
        <p class="btn"
           :style="{backgroundImage:'url(' + uiStyle.taskBtn.bgImg + ')',color:uiStyle.taskBtn.color}">去分享邀请</p>
        <p class="record-btn"
           :style="{color:uiStyle.taskInvite}">查看我的邀请记录</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'increaseCount',
  components: {},
  props: ['uiStyle'],
  data() {
    return {
      reservationTime: '',
      testDriveTime: '',
      invitationTime: '',
      list: [
        {
          "chanceMode": "ALL_TIMES",
          "chanceTimes": 0,
          "taskType": "RESERVATION_ONLINE"
        },
        {
          "chanceMode": "ALL_TIMES",
          "chanceTimes": 0,
          "taskType": "TEST_DRIVE"
        },
        {
          "chanceMode": "ALL_TIMES",
          "chanceTimes": 0,
          "taskType": "INVITATION"
        }
      ]
    }
  },
  watch: {
    list: {
      immediate: true,
      handler(val) {
        // val.forEach(item => {
        //   if (item.taskType === 'RESERVATION_ONLINE') {
        //     this.reservationTime = item.chanceTimes
        //   } else if (item.taskType === 'INVITATION') {
        //     this.invitationTime = item.chanceTimes
        //   } else {
        //     this.testDriveTime = item.chanceTimes
        //   }
        // })
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.increase-count {
  padding-top: 70px;

  .taskItem {
    margin: 0px auto 60px;
  }

  .item {
    position: relative;
    margin: 0px auto 60px;
    padding-top: 60px;
    padding-bottom: 26px;
    width: 656px;
    height: 270px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    background-image: url("../../../../../assets/images/game/game_increase-bg.png");

    &:last-child {
      margin-bottom: 0px;
    }

    .title-wrapper {
      position: absolute;
      left: 199px;
      top: -24px;
      background: linear-gradient(92deg, rgba(250, 224, 138, 1), rgba(255, 196, 90, 1));
      border-radius: 13px 13px 13px 13px;
      width: 258px;

      .before {
        content: "";
        position: absolute;
        left: 22px;
        top: 26px;
        width: 8px;
        height: 8px;
        background: #a13d01;
        transform: rotate(45deg);
      }

      .after {
        content: "";
        position: absolute;
        right: 22px;
        top: 26px;
        width: 8px;
        height: 8px;
        background: #a13d01;
        transform: rotate(45deg);
      }

      .title {
        position: relative;
        font-size: 34px;
        font-family: AlibabaPuHuiTiB;
        font-weight: bold;
        color: rgba(161, 61, 1, 1);
        line-height: 60px;
        width: 200px;
        left: 30px;
      }
    }

    .intro {
      font-size: 32px;
      font-family: AlibabaPuHuiTiB;
      font-weight: bold;
      color: rgba(161, 61, 1, 1);
      line-height: 42px;
      text-align: center;
    }

    .info {
      font-size: 27px;
      font-family: AlibabaPuHuiTiR;
      font-weight: 400;
      color: rgba(68, 68, 68, 1);
      line-height: 42px;
      text-align: center;
      margin: 8px 0;
    }

    .btn {
      margin: 0px auto;
      width: 284px;
      height: 82px;
      line-height: 75px;
      text-align: center;
      background-image: url("../../../../../assets/images/game/game_increase_btn_bg.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius: 41px;
      font-size: 30px;
      font-family: AlibabaPuHuiTiB;
      font-weight: bold;
      color: rgba(114, 46, 24, 1);

      &:active {
        opacity: 0.9;
      }
    }
  }

  .share {
    height: 328px;

    .intro {
      font-size: 26px;
      line-height: 38px;
    }

    .info {
      font-size: 25px;
      line-height: 38px;
      margin: 8px 0;
    }

    .record-btn {
      font-size: 25px;
      font-family: AlibabaPuHuiTiR;
      font-weight: 400;
      text-decoration: underline;
      color: rgba(254, 86, 22, 1);
      line-height: 38px;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
