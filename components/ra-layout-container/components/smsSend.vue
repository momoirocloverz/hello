<template>
  <el-form-item label="验证码："
                prop="smsCode">
    <el-input maxlength="6"
              placeholder="请输入手机验证码"
              size="small"
              v-model="_smsCode">
      <template slot="append">
        <el-button class="el-link send-button"
                   @click.stop="sentCode"
                   :disabled="!!timer"
                   size="small">
          <span>{{timer?`${cutTime}秒后重试`:'发送验证码'}}</span>
        </el-button>
      </template>
    </el-input>
  </el-form-item>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { sms_check_api, sms_send_api, account_updatePhone_api } from "@/api";
import { State } from "vuex-class";

@Component
export default class App extends Vue {
  @PropSync("smsCode", { type: String, default: "" }) _smsCode!: string;
  @PropSync("smsService", { type: String, default: "" }) _smsService!: string;
  @Prop({ required: true, type: String, default: "" }) private phone!: string;
  @Prop({ type: Boolean, default: true }) private isAutoSend!: boolean;

  @State(state => state.user.info) userInfo: any;
  private timer: number = 0;
  private cutTime: number = 60;

  /**
   * @description 发送验证码
   */
  // 点击发送按钮
  private sentCode() {
    if (!this.phone) {
      let _msg = this.isAutoSend ? "获取手机号失败" : "请先输入手机号";
      this.showMsg(_msg, "warning");
      return;
    }
    if (!this.isAutoSend && !/^1[3456789]\d{9}$/.test(this.phone)) {
      return;
    }
    if (this.timer) {
      return;
    }
    this.smsSendApi();
  }
  /**
   * @description 发送短信验证码
   * @param 是否需要发送成功弹窗 -默认要弹
   */
  private async smsSendApi(hasShowMsg: boolean = true) {
    if (!this.phone) {
      return;
    }
    let _param = { mobile: this.phone, service: this._smsService };
    try {
      await sms_send_api(_param);
      hasShowMsg && this.showMsg("验证码已发送，请注意查收");
      this.timer = setInterval(() => {
        if (this.cutTime === 1) {
          clearInterval(this.timer);
          this.timer = 0;
          this.cutTime = 60;
        }
        this.cutTime--;
      }, 1000);
    } catch (error) {
      this.log(error);
    }
  }

  created() {
    this.isAutoSend && this.sentCode();
  }
}
</script>
<style lang='scss' scoped>
.send-button {
  padding: 0 3px;
  span {
    font-size: 11px;
    color: #409eff;
  }
}
</style>