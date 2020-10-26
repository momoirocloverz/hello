<!--绑定微信号-->
<template>
  <div class="bind-chat">
    <breadcrumb-group :breadGroup="[{label:'公众号',to:''},{label:'公众号设置',to:'/wechat/set/bindWechat'}]" />
    <div class="step3">
      <div class="chat-info mb-15">
        <div class="common_flex-space-center">
          <div>
            <div class="common_flex-align-center">
              <h2>{{pageData.nickName}}</h2>
              <span class="tag">{{typeName}}</span>
            </div>
            <div class="base-info">
              <div class="left">
                <p class="tip-text">基本信息</p>
                <p>
                  <span class="label">Appid：</span>
                  <span class="info">{{pageData.authorizerAppid}}</span>
                </p>
                <p>
                  <span class="label">微信号：</span>
                  <span class="info">{{pageData.userName}}</span>
                </p>
                <p>
                  <span class="label">主体名称：</span>
                  <span class="info">{{pageData.principalName}}</span>
                </p>
              </div>
              <div class="right"></div>
            </div>
          </div>
          <img :src="pageData.qrcodeUrl"
               alt=""
               v-if="pageData.qrcodeUrl !== '0'"
               class="qrcode">
        </div>
        <el-divider></el-divider>
        <div class="deal-wrap">
          <div class="remove-bind"
               @click="removeBind">
            <i class="el-icon-lock"></i>
            <span>解除绑定</span>
          </div>
          <!-- <div class="re-auth"
               @click="reAuth">
            <i class="el-icon-refresh"></i>
            <span>重新授权</span>
          </div> -->
        </div>
      </div>
      <div class="auth-wrap">
        <div class="tip-text">
          <h2>已授权列表</h2>
        </div>
        <div class="auth-list">
          <div v-for="(item, idx) in authList"
               :key="idx"
               class="auth-item">
            <i class="el-icon-check"></i>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
    <remove-bind :dialog="dialog"
                 @close="dialog.show = false" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RemoveBind from "./components/removeBind.vue";
import api from "@/api/restful";
import { FUNC_LIST, VERIFY_TYPE_INFO, SERVICE_TYPE_INFO } from "@/const/wechat";
import { storeInfoSetting } from "@/utils/userSetting";

interface DialogInter {
  title: string;
  show: boolean;
}
@Component({
  name: "bindWechat",
  components: {
    RemoveBind
  }
})
export default class extends Vue {
  private pageData: any = {};
  authList: Array<string> = [];
  typeName: string = "";
  dialog: DialogInter = {
    title: "取消绑定",
    show: false
  };
  get organId() {
    return storeInfoSetting.getInfo().organId;
  }
  private removeBind() {
    this.dialog.show = true;
  }
  // private reAuth() {
  //   let h = this.$createElement;
  //   let message: any = h("div", {}, [
  //     h("p", {}, `1、重新授权时不可换绑其他微信公众号 ，否则重新授权将失败？`),
  //     h("p", `2、为保证您在平台功能的正常使用，授权时请保持默认选择，把开放平台账号管理权限统一授权。`)
  //   ]);
  //   this.$confirm(message, "提示").then(res => {
  //     this.$router.push({
  //       path: "/wechat/set/index?type=1"
  //     });
  //   });
  // }
  private async getInfo() {
    this.authList = [];
    // let info = await api.get({ url: "GET_AUTH_INFO", organId: this.organId });
    let info: any = localStorage.getItem("wx_auth_info");
    info = JSON.parse(info);

    if (info.data) {
      let funcs: Array<number> = [];
      Object.assign(info.data, info.data.authorizationInfo, info.data.authorizerInfo);
      funcs = info.data.authorizationInfo.funcInfo;
      funcs.map((v: number) => {
        this.authList.push(FUNC_LIST[v - 1]);
      });
      this.typeName = VERIFY_TYPE_INFO[info.data.verifyTypeInfo + ""] + SERVICE_TYPE_INFO[info.data.serviceTypeInfo];
      this.pageData = info.data;
    } else {
      if (info.code !== "000000") {
        return this.$message({
          type: "error",
          message: info.data.msg
        });
      } else {
        this.$message({
          type: "error",
          message: "还未授权公众号"
        });
        this.$router.push({
          path: "/wechat/set/index"
        });
      }
    }
  }
  mounted() {
    this.getInfo();
  }
  async beforeRouteEnter(to: any, from: any, next: any) {
    // 微信图片防盗链会导致图片不显示，这里需要设置回来
    let viewport: any = document.querySelector("meta[name=referrer]");
    if (viewport) {
      viewport.setAttribute("content", "never");
    }
    next();
  }
}
</script>

<style scoped lang="scss">
.bind-chat {
  .tip-text {
    display: flex;
    align-items: center;
    font-weight: bold;
    &:before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 15px;
      background: $primary-color;
      margin-right: 10px;
    }
  }

  .chat-info {
    background: #fff;
    padding: 20px;
    .base-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tag {
      background: $wechat-color;
      padding: 5px;
      color: #fff;
      border-radius: 5px;
      margin-left: 10px;
    }
    .deal-wrap {
      overflow: hidden;
      .remove-bind,
      .re-auth {
        float: left;
        margin-right: 30px;
        cursor: pointer;
        i {
          font-weight: bold;
          color: $primary-color;
          font-size: 18px;
          margin-right: 10px;
        }
      }
    }
  }
  .auth-wrap {
    min-height: 45vh;
    background: #fff;
    padding: 20px;
    .auth-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .auth-item {
        width: 30%;
        margin-bottom: 10px;
        .el-icon-check {
          font-weight: bold;
          color: $primary-color;
          font-size: 16px;
          margin-right: 5px;
        }
        &:nth-of-type(2n) {
          width: 70%;
        }
      }
    }
  }

  .qrcode {
    width: 150px;
    height: 150px;
  }
}
</style>
