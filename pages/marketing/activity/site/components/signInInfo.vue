<template>
  <div class="sign_in_info">
    <div class="sign_title">签到处</div>
    <div class="sign_name">{{ activityInfo.campaignName }}</div>
    <div class="sign_duration">
      <div class="duration_time">活动时间：{{ activityInfo.validFrom }}-{{ activityInfo.validTo }}</div>
    </div>
    <div class="sign_qrcode" v-if="sysPlat === 'agent'">
      <div id="qrCode" class="qr-code" ref="qrcodeRef"></div>
    </div>
  </div>
</template>

<script lang="ts">
import QRCode from "qrcodejs2";
import { Component, Vue, Prop } from "vue-property-decorator";
import { storeInfoSetting } from "@/utils/userSetting";

const prefix = process.env.VUE_APP_API_PREFIX;
const domain = process.env.VUE_APP_DOMAIN;

@Component({
  name: "signInInfo",
  components: {}
})
export default class extends Vue {
  @Prop({ default: {} }) activityInfo: any;
  sysPlat: any = "agent";
  get organId() {
    return storeInfoSetting.getInfo().organId;
  }
  get accountId() {
    return storeInfoSetting.getInfo().userId;
  }

  private qrCode(id: string, url: string) {
    this.$nextTick(() => {
      let qrcode = new QRCode(id, {
        width: 226,
        height: 226,
        colorDark: "#000000",
        colorLight: "#ffffff",
        typeNumber: 4
      });
      qrcode.clear();
      qrcode.makeCode(url);
    });
  }
  mounted() {
    this.sysPlat = this.$route.query.sysPlat;
    this.qrCode(
      "qrCode",
      `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${
        this.organId
      }&wxScope=SNSAPI_BASE&webRedirectUrl=activityDetail?id=${this.$route.query.releaseId}:2:${this.accountId}:sign`
    );
  }
}
</script>

<style lang="scss">
.sign_in_info {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: absolute;
  right: 0;
  top: 0;
  padding: 100px 38px 80px;
  height: 100%;
  overflow: hidden;
  width: 620px;
  text-align: center;
  line-height: 1;
  font-family: PingFang SC;
  .sign_title {
    font-family: FZChaoCuHei-M10S;
    font-size: 140px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }
  .sign_name {
    font-size: 36px;
    color: rgba(255, 255, 255, 1);
    line-height: 59px;
  }
  .sign_duration {
    margin: 0px auto;
    padding: 18px 22px;
    background: rgba(171, 0, 236, 0.2);
    border-radius: 46px;
    width: fit-content;
    .duration_time {
      padding: 0px 24px;
      line-height: 55px;
      font-size: 20px;
      color: rgba(255, 255, 255, 1);
      border: 1px solid rgba(255, 255, 255, 1);
      border-radius: 28px;
      width: fit-content;
    }
  }
  .sign_qrcode {
    margin: 0px auto;
    padding: 28px;
    background: rgba(195, 50, 82, 0.41);
    width: fit-content;
    .qr-code {
      width: 256px;
      height: 256px;
      border: 15px solid #fff;
    }
  }
}
</style>
