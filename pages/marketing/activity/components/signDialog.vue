<!--现场签到-->
<template>
  <el-dialog :title="dialogObj.title" :visible.sync="dialogObj.show" :width="dialogWidth" :before-close="handleClose">
    <div class="sign-wrap" v-if="isAgent">
      <div class="sign-container" ref="signRef">
        <div id="signCode" class="qr-code"></div>
      </div>
      <div class="bottom-btn">
        <el-button size="small" @click="downloadPost">
          <a class="down" ref="downRef">下载{{ dialogObj.title }}二维码</a>
        </el-button>
        <el-button size="small" type="primary" @click="toScreen">投屏</el-button>
      </div>
    </div>
    <div v-else>
      <search-table
        class="issued-table"
        ref="issuedTableRef"
        :url="loadUrl"
        :tableColumns="tableColumns"
        :searchConfig="searchConfig"
      />
    </div>
    <el-dialog :title="dialogObj.title" :visible.sync="show" width="400px" append-to-body="">
      <div class="sign-wrap">
        <div class="sign-container" ref="signRef1" v-if="show">
          <div id="signCode1" class="qr-code" ref="qrcodeRef"></div>
        </div>
        <div class="bottom-btn">
          <el-button size="small" @click="downloadPost">
            <a class="down" ref="downRef">下载{{ dialogObj.title }}二维码</a>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts">
import QRCode from "qrcodejs2";
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
import html2canvas from "html2canvas";
const prefix = process.env.VUE_APP_API_PREFIX;
const domain = process.env.VUE_APP_DOMAIN;
import searchTable from "@/components/search-table/index.vue";
import { storeInfoSetting } from "@/utils/userSetting";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "popularizeDialog",
  components: {
    searchTable
  }
})
export default class extends mixins(ActivityMixin) {
  @Ref() private issuedTableRef: any;
  @Ref() downRef: any;
  @Ref() signRef: any;
  @Ref() signRef1: any;
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: "" }) private activeMode: string;
  @Prop({ default: () => {} }) private row: any;
  show: boolean = false;
  get loadUrl() {
    return `campaign/common/sponsored/${this.row.campaignId}/issued_dealer`;
  }
  get accountId() {
    return storeInfoSetting.getInfo().userId;
  }
  get organId() {
    return storeInfoSetting.getInfo().organId;
  }
  get dialogWidth() {
    return this.isAgent ? "400px" : "60%";
  }
  get tableColumns() {
    return [
      {
        title: "经销商名称",
        key: "dealerName"
      },
      {
        operate: true,
        title: "操作",
        setBtns: (row: any, index: number) => {
          return [
            {
              disabled: !row.isWechatBind,
              label: "查看现场签到二维码",
              handler: () => this.viewDelaerCode(row)
            }
          ];
        }
      }
    ];
  }
  get searchConfig() {
    return {
      props: [
        {
          tag: "select",
          prop: "businessUnitId",
          placeholder: "事业部",
          keyProp: {
            label: "name",
            value: "id"
          },
          options: this.bu2Region,
          change: this.changeBuId
        },
        {
          tag: "select",
          prop: "regionId",
          placeholder: "大区",
          keyProp: {
            label: "name",
            value: "id"
          },
          options: this.allRegion,
          change: this.changeAllRegion
        },
        {
          tag: "select",
          prop: "dealerCode",
          placeholder: "经销商",
          keyProp: {
            label: "dealerName",
            value: "id"
          },
          options: this.dealerList
        }
      ]
    };
  }
  jumpUrl(row?: any): string {
    let { campaignType, imGroupId, releaseId, dealerId } = row;
    let url: string = "";
    let _organId = this.isFactory ? `2:${dealerId}` : this.organId;
    switch (this.dialogObj.type) {
      case "message":
        url = `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${_organId}&wxScope=SNSAPI_BASE&webRedirectUrl=msgWall?releaseId=${
          this.row.releaseId
        }:-1:${this.accountId || -1}`;
        break;
      case "sign":
        url = `${domain}${prefix}wechat/web_auth_url?channel=MALL&organId=${_organId}&wxScope=SNSAPI_BASE&webRedirectUrl=activityDetail?id=${
          this.row.releaseId
        }:-1:${this.accountId || -1}:sign`;
        break;
    }
    return url;
  }
  toScreen() {
    this.$emit("goSign", this.dialogObj.info);
  }
  handleClose(): void {
    this.dialogObj.show = false;
    this.dialogObj.info = {};
  }

  downloadPost(): void {
    let ref = this.isAgent ? this.signRef : this.signRef1;
    ref.style.display = "block";
    this.$nextTick(() => {
      html2canvas(ref, {
        allowTaint: true,
        useCORS: true
      }).then((canvas: any) => {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = canvas.toDataURL("image/png");
        a.download = this.dialogObj.info.label;
        a.click();
      });
    });
  }
  private qrCode(id: string, url: string) {
    this.$nextTick(() => {
      let qrcode = new QRCode(id, {
        width: 230,
        height: 190,
        colorDark: "#000000",
        colorLight: "#ffffff",
        typeNumber: 4
      });
      qrcode.clear();
      qrcode.makeCode(url);
    });
  }
  viewDelaerCode(row: any) {
    this.show = true;
    this.qrCode("signCode1", this.jumpUrl(row));
  }
  setFilterForm(params: any) {
    this.issuedTableRef.setFilterForm(params);
  }
  changeBuId(val: any) {
    this.changeBu2(val);
    this.setFilterForm({ regionId: null, dealerCode: null });
  }
  changeAllRegion(val: any) {
    this.changeRegion(val);
    this.setFilterForm({ dealerCode: null });
  }
  mounted() {
    if (this.isAgent) {
      this.qrCode("signCode", this.jumpUrl(this.row));
    } else {
      this.loadBu2Region();
    }
  }
}
</script>

<style scoped lang="scss">
.sign-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sign-container {
  background: $primary-color;
  margin-bottom: 20px;
  height: 260px;
  width: fit-content;
  padding: 20px;
  &.no-show {
    visibility: hidden;
  }
  .qr-code {
    width: 260px;
    height: 220px;
    border: 15px solid #fff;
  }
  .bottom-btn {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    .down {
      text-decoration: none;
    }
    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
