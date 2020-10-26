<template>
  <div class="sign-wrap">
    <fullScreenBtn />
    <!--签到舞台-->
    <sign-stage :signArr="personArray" />
    <!--弹幕-->
    <barrage :barrageItem="barrageItem"
             v-if="activityInfo.messageBoardEnabled" />
    <!--当前签到用户-->
    <current-person-card :currentPerson="currentPerson" />
    <sign-in-info :activityInfo="activityInfo"
                  v-if="activityInfo.campaignName"></sign-in-info>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import Barrage from "@/components/common-barrage/barrage.vue";
import CurrentPersonCard from "./components/currentPersonCard.vue";
import SignStage from "./components/signStage.vue";
import fullScreenBtn from "./components/full-screen-btn.vue";
import SignInInfo from "./components/signInInfo.vue";
import { storeInfoSetting } from "@/utils/userSetting";
import { imUserSig, groupMember, getSiteDetail, getSignInList } from "@/api";
import webim from "@/plugins/webim.js";
import dayjs from "dayjs";

interface CurrentPerson {
  avatar: string;
  nickName: string;
}
interface barrageItem {
  avatar: string;
  nickName: string;
  content: string;
  style: string;
}
interface activityInfo {
  campaignName: string;
  validFrom: string;
  validTo: string;
  messageBoardEnabled: boolean;
}
@Component({
  name: "signIn",
  components: {
    Barrage,
    CurrentPersonCard,
    SignStage,
    SignInInfo,
    fullScreenBtn
  }
})
export default class extends Vue {
  personArray: Array<any> = [];
  lastPersonArray: Array<any> = [];
  activityInfo: activityInfo = { campaignName: "", validFrom: "", validTo: "", messageBoardEnabled: true };
  barrageItem: barrageItem = { avatar: "", nickName: "", content: "", style: "" };
  currentPerson: CurrentPerson = { avatar: "", nickName: "" };
  // 弹幕轨道，设置为三条
  trackIdx: number = 0;
  timer: any = null;
  /**
   * 获取签到人数列表
   */
  async getSignInList() {
    let params = {
      releaseId: this.$route.query.releaseId
    };
    let res = await getSignInList(params);
    if (res.code === "000000") {
      this.getDefaultSignList();
      if (res.data.length > this.lastPersonArray.length) {
        for (let i = this.lastPersonArray.length; i < res.data.length; i++) {
          this.lastPersonArray.push({
            avatar: res.data[i].avatar
          });
          this.personArray.splice(i, 1, {
            ...res.data[i],
            avatar: res.data[i].avatar,
            p_x: (i % 20) + 1,
            p_y: Math.floor(i / 20) + 1
          });
          this.currentPerson = {
            avatar: res.data[i].avatar,
            nickName: res.data[i].name
          };
        }
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 轮询签到的列表
        this.getSignInList();
      }, 15000);
    }
  }
  async imUserSig() {
    let appAccount = storeInfoSetting.getInfo().userId;
    let res = await imUserSig({ appAccount: appAccount });
    this.loginIM(res.data);
  }
  async groupMember() {
    await groupMember({
      GroupId: this.$route.query.imGroupId,
      MemberList: [
        {
          Member_Account: storeInfoSetting.getInfo().userId
        }
      ],
      Silence: 1
    });
  }
  async getDetail() {
    try {
      let res = await getSiteDetail({
        releaseId: this.$route.query.releaseId
      });
      let _detailData = res.data || {};
      let { campaignName, validFrom, validTo, messageBoardEnabled } = _detailData;
      this.activityInfo.messageBoardEnabled = messageBoardEnabled;
      this.activityInfo.campaignName = campaignName;
      this.activityInfo.validFrom = dayjs(validFrom).format("YYYY/MM/DD HH:mm");
      if (validFrom !== validTo) {
        this.activityInfo.validTo = dayjs(validTo).format("YYYY/MM/DD HH:mm");
      } else {
        this.activityInfo.validTo = dayjs(validTo).format("HH:mm");
      }
    } catch (e) {
      console.log(e);
    }
  }
  loginIM(data: any) {
    const loginInfo = {
      sdkAppID: data.sdkAppID, // 用户所属应用id,必填
      identifier: data.identifier, // 当前用户ID,必须是否字符串类型，必填
      userSig: data.userSig // 当前用户身份凭证，必须是字符串类型，必填
    };
    const listeners = {
      onMsgNotify: this.onMsgNotify // 监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    };
    const options = {
      isAccessFormalEnv: true, // 是否访问正式环境，默认访问正式，选填
      isLogOn: false // 是否开启控制台打印日志,默认开启，选填
    };
    webim.webim.login(
      loginInfo,
      listeners,
      options,
      (res: any) => {
        // 将当前后台管理登陆账号加入im群聊
        this.groupMember();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  onMsgNotify(newMsgList: any) {
    console.log(newMsgList);
    if (newMsgList && newMsgList.length !== 0) {
      for (let msg of newMsgList) {
        console.log(this.$route.query.imGroupId === msg.sess._impl.id);
        if (this.$route.query.imGroupId === msg.sess._impl.id) {
          let data = {
            avatar: msg.fromAccountHeadurl,
            nickName: msg.fromAccountNick,
            content: msg.elems[0].content.text,
            style: ""
          };
          let top = this.trackIdx * 110;
          let height = 50;
          data.style = `margin-top:${top}px;`;
          if (this.trackIdx === 2) {
            this.trackIdx = 0;
          } else {
            this.trackIdx++;
          }
          console.log(data);
          this.barrageItem = data;
        }
      }
    }
  }
  getDefaultSignList() {
    this.personArray = [];
    for (var i = 0; i < 199; i++) {
      this.personArray.push({
        avatar: require("../../../../assets/images/activity/signAvatar.png"),
        p_x: (i % 20) + 1,
        p_y: Math.floor(i / 20) + 1
      });
    }
  }
  mounted() {
    this.getDetail();
    this.imUserSig();
    this.getSignInList();
  }
  beforeDestroy() {
    clearTimeout(this.timer);
  }
}
</script>

<style scoped lang="scss">
.sign-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("../../../../assets/images/activity/signBg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}
</style>
