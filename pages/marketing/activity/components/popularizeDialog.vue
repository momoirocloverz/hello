<!--推广-->
<template>
  <el-dialog
    class="pop-wrap"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="375px"
    :before-close="handleClose"
  >
    <div class="pop-content">
      <div class="pop-container" ref="popRef">
        <div class="top-content">
          <div class="dealer-name">-{{ dealerName }}-</div>
          <div class="tip-desc">海量优惠劵等你来拿</div>
          <div class="post">
            <img class="post-url" alt="活动海报" :src="actDetailInfo.posterUrl" />
          </div>
        </div>
        <div class="desc">
          <h1 class="name">{{ campaignName }}</h1>
          <div class="time">
            活动时间：{{ actDetailInfo.validFrom | momentTime }}~{{ actDetailInfo.validTo | momentTime }}
          </div>
        </div>
        <div id="qrCode" class="qr-code" ref="qrcodeRef"></div>
        <div class="tip-center">微信扫码参与</div>
      </div>
      <div class="bottom-btn">
        <el-button size="small" @click="downloadPost">
          <a class="down" ref="downRef">下载海报</a>
        </el-button>
        <el-button size="small" class="copy-link" @click="copyLink">复制活动链接</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import QRCode from "qrcodejs2";
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
import { State, Action } from "vuex-class";
import html2canvas from "html2canvas";
const prefix = process.env.VUE_APP_API_PREFIX;
const domain = process.env.VUE_APP_DOMAIN;
import { storeInfoSetting } from "@/utils/userSetting";
import Clipboard from "clipboard";
import { shareLinkRecord, downloadRecord } from "@/api";
@Component({
  name: "popularizeDialog"
})
export default class extends Vue {
  @Ref() qrcodeRef: any;
  @Ref() downRef: any;
  @Ref() popRef: any;
  @Prop({ default: "lottery" }) private activeType: string;
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @State(state => state.activity.actDetailInfo) private actDetailInfo!: any;
  get dealerName() {
    return storeInfoSetting.getInfo().info.dealerName;
  }
  get campaignName(): string {
    return this.actDetailInfo.campaignName || this.actDetailInfo.name;
  }
  get accountId() {
    return storeInfoSetting.getInfo().userId;
  }
  get organId() {
    return storeInfoSetting.getInfo().organId;
  }
  get jumpUrl(): string {
    let { campaignType } = this.actDetailInfo;
    let url: string = "";
    switch (this.activeType) {
      case "lottery":
        // 抽奖活动
        if (campaignType === 0) {
          // 大转盘
          url = `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${
            this.organId
          }&wxScope=SNSAPI_BASE&webRedirectUrl=turntable?id=${this.actDetailInfo.releaseId}:-1:${this.accountId}`;
        } else if (campaignType === 1) {
          // 九宫格
          url = `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${
            this.organId
          }&wxScope=SNSAPI_BASE&webRedirectUrl=gridsOfNine?id=${this.actDetailInfo.releaseId}:-1:-1`;
        } else {
          // 刮刮乐
          url = `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${
            this.organId
          }&wxScope=SNSAPI_BASE&webRedirectUrl=scratchCard?id=${this.actDetailInfo.releaseId}:-1:-1`;
        }
        break;
      case "sales":
        // 团购
        url = `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${
          this.organId
        }&wxScope=SNSAPI_BASE&webRedirectUrl=group?-1:-1`;
        break;
      case "site":
        url = `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${
          this.organId
        }&wxScope=SNSAPI_BASE&webRedirectUrl=activityDetail?id=${this.actDetailInfo.releaseId}:-1:-1`;
        break;
    }
    return url;
  }
  handleClose() {
    this.dialogObj.show = false;
  }
  copyLink() {
    let clipboard = new Clipboard(".copy-link", {
      text: () => {
        return this.jumpUrl;
      }
    });
    clipboard.on("success", (e: any) => {
      let { campaignId, id } = this.actDetailInfo;

      shareLinkRecord(campaignId || id);
      this.$message.success("活动链接复制成功");
      clipboard.destroy();
    });
    clipboard.on("error", (e: any) => {
      this.$message.error("活动链接复制成功");
      clipboard.destroy();
    });
  }

  downloadPost() {
    this.$nextTick(() => {
      html2canvas(this.popRef, {
        allowTaint: true,
        useCORS: true
      }).then((canvas: any) => {
        let { campaignId, id } = this.actDetailInfo;
        downloadRecord(campaignId || id);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = canvas.toDataURL("image/png");
        a.download = this.campaignName;
        a.click();
      });
    });
  }
  private qrCode(id: string, url: string) {
    this.$nextTick(() => {
      let qrcode = new QRCode(id, {
        width: 160,
        height: 160,
        colorDark: "#000",
        colorLight: "#fff",
        typeNumber: 4
      });
      qrcode.clear();
      qrcode.makeCode(url);
    });
  }
  mounted() {
    this.qrCode("qrCode", this.jumpUrl);
  }
}
</script>

<style lang="scss" scoped>
.pop-wrap {
  /*display: flex;*/
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .el-dialog__body {
    padding: 0;
  }
  .pop-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .pop-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 375px;
    height: 560px;
    background: url("../../../../assets/images/activity/poster.png") no-repeat;
    background-size: cover;
    .top-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      padding: 15px 0;
      .dealer-name {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .tip-desc {
        font-size: 12px;
        margin-bottom: 20px;
      }
    }
    .post {
      width: 262px;
      height: 136px;
      min-height: 136px;
      .post-url {
        width: 100%;
        height: 100%;
      }
    }
    .desc {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 15px 0;
      border-bottom: 1px dotted #ccc;
      .name {
        font-weight: bold;
        font-size: 16px;
        color: #000;
      }
      .time,
      .local {
        font-size: 14px;
        color: $tip-color;
      }
    }
    .qr-code {
      display: flex;
      justify-content: center;
      text-align: center;
      height: 160px;
      margin-top: 20px;
      background: #fff;
      padding: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .tip-center {
      text-align: center;
      margin: 5px 0 15px;
      color: #999;
    }
  }

  .bottom-btn {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 20px;
    .down {
      text-decoration: none;
    }
    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
