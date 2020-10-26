<template>
  <elBtnDialog :visible.sync="_visible"
               title="修改密码"
               :dialogAttr="{width:'415px'}"
               :saveLoading="submitLoading"
               :saveAutoClose="false"
               :showClose="!isFirstLogin"
               @save="submit">
    <p class="tip"> 为保障您的账号安全，需要手机验证</p>
    <el-form @submit.native.prevent
             :model="subForm"
             class="sub_form"
             ref="ruleForm"
             :rules="rules"
             label-width="110px">
      <el-form-item label="当前手机号：">
        {{currentPhone || '—'}}
      </el-form-item>
      <sms-send :smsCode.sync="subForm.smsCode"
                :smsService="subForm.smsService"
                :phone="phone || ''"></sms-send>
      <el-form-item label="新密码："
                    prop="password">
        <el-input maxlength="16"
                  :placeholder="placeholder"
                  v-model.trim="subForm.password"
                  v-formatNotTxt="subForm.password"
                  size="small"
                  show-password>
          <template slot="suffix">
            <span>{{subForm.password.length }}/16</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认新密码："
                    prop="confirmPassword">
        <el-input maxlength="16"
                  :placeholder="placeholder"
                  v-model.trim="subForm.confirmPassword"
                  v-formatNotTxt="subForm.confirmPassword"
                  size="small"
                  show-password>
          <template slot="suffix">
            <span>{{subForm.confirmPassword.length}}/16</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </elBtnDialog>
</template>

<script lang='ts'>
import { Component, Vue, PropSync, Watch, Ref, Prop } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import ElBtnDialog from "@/components/el-btn-dialog/index.vue";
import SmsSend from "./smsSend.vue";
import { auth_forgetAndModifyPassword_api } from "@/api";
import { pwdCheck } from "@/const/reg";
import { filterUser } from "@/utils/userSetting";
import CRYPT from "@/plugins/crypt.js";

import _ from "lodash";

// 发送短信验证码需要的-service
const SMS_SERVICE: string = "forgetPassword";

interface SubForm {
  phone: string;
  password: string;
  confirmPassword: string;
  smsCode: string;
  smsService: string;
}
interface Rules {
  password: element.FormRule[];
  confirmPassword: element.FormRule[];
  smsCode: element.FormRule[];
}

@Component({
  components: {
    ElBtnDialog,
    SmsSend
  }
})
export default class App extends Vue {
  @Ref() readonly ruleForm: element.Refs;
  @PropSync("visible", { type: Boolean, default: false }) _visible: boolean;
  @Prop({ type: Boolean, default: false }) isFirstLogin: boolean;
  @State(state => state.user.info) userInfo: any;
  @Action("setLogout", { namespace: "user" })
  setLogout: Function;
  private placeholder: string = "8~16位密码,包含大小写字母数字";
  private submitLoading: boolean = false;
  private subForm: SubForm = {
    confirmPassword: "",
    phone: "",
    password: "",
    smsCode: "",
    smsService: SMS_SERVICE
  };
  private rules: Rules = {
    password: [
      {
        required: true,
        trigger: "blur",
        validator: pwdCheck
      }
    ],
    confirmPassword: [
      {
        required: true,
        trigger: "blur",
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            if (value !== this.subForm.password) {
              callback(new Error("两次输入密码不一致!"));
            } else {
              callback();
            }
          } else {
            callback(new Error("请再次输入8-16位新密码"));
          }
        }
      }
    ],
    smsCode: [{ required: true, message: "请输入验证码", trigger: "change" }]
  };
  get currentPhone() {
    return (
      this.userInfo.info &&
      this.userInfo.info.phone &&
      this.userInfo.info.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    );
  }
  get phone() {
    return this.userInfo.info && this.userInfo.info.phone;
  }

  /**
   * @description 提交修改密码
   */
  // 点击提交按钮
  private submit() {
    this.ruleForm.validate((valid: boolean) => {
      if (valid) {
        this.submitRegisterApi();
      }
    });
  }
  // 请求修改密码API
  private async submitRegisterApi() {
    this.submitLoading = true;
    let _param = _.cloneDeep(this.subForm);
    delete _param.confirmPassword;
    try {
      await auth_forgetAndModifyPassword_api({
        ..._param,
        password: CRYPT.encrypt(_param.password),
        phone: this.userInfo.info.phone,
        channel: filterUser().channel
      });
      this.submitLoading = false;
      this._visible = false;
      this.showMsg("操作成功，请重新登录");
      this.setLogout(false);
    } catch (error) {
      this.submitLoading = false;
      this.log(error);
    }
  }
}
</script>
<style lang='scss' scoped>
.tip {
  color: #999;
  margin-top: 0;
  font-size: 13px;
}
</style>